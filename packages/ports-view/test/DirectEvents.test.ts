import type { Rpc } from '@lvce-editor/rpc'
import { beforeEach, expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const directState: { commands: Readonly<Record<string, (...args: readonly any[]) => Promise<void>>> } = { commands: {} }
const processInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>()
const createRpc = jest.fn(async (options: Readonly<{ commandMap: Readonly<Record<string, (...args: readonly any[]) => Promise<void>>> }>) => {
  directState.commands = options.commandMap
  return { invoke: processInvoke }
})
// eslint-disable-next-line jest/no-restricted-jest-methods
jest.unstable_mockModule('@lvce-editor/rpc', () => ({ PlainMessagePortRpc: { create: createRpc } }))

const { commandMap } = await import('../src/parts/CommandMap/CommandMap.ts')
const PortsStates = await import('../src/parts/PortsStates/PortsStates.ts')
const { createTestState } = await import('../src/parts/TestState/TestState.ts')
const { render2 } = await import('../src/parts/Render2/Render2.ts')
const { diff2 } = await import('../src/parts/Diff2/Diff2.ts')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.ts')
const { ViewletCommand } = await import('@lvce-editor/constants')
const workerInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>()

beforeEach(async () => {
  jest.clearAllMocks()
  workerInvoke.mockResolvedValue(undefined)
  processInvoke.mockResolvedValue(17)
  RendererWorker.set({ invoke: workerInvoke } as unknown as Rpc)
  PortsStates.registerCommands(commandMap)
  const state = createTestState({ loaded: true })
  PortsStates.set(1, state, state)
  await commandMap['Ports.handleMessagePort']({} as MessagePort)
})

test('dispatches input on the direct port and requests a frame without forwarding the command', async () => {
  await directState.commands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', '3000')
  expect(PortsStates.get(1).newState.addPortValue).toBe('3000')
  expect(workerInvoke.mock.calls).toEqual([['Viewlet.requestRender', 1]])
  expect(createRpc).toHaveBeenCalledWith(expect.objectContaining({ messagePort: {} }))
})

test('serializes asynchronous work with following input and ignores disposed in-flight work', async () => {
  const { promise: pending, resolve: release } = Promise.withResolvers<void>()
  PortsStates.registerCommands({
    'Ports.wait': PortsStates.wrapSerialCommand(async (state) => {
      await pending
      return { ...state, addPortValue: 'old' }
    }),
  })
  const first = directState.commands['Viewlet.executeViewletCommand'](1, 'wait')
  const second = directState.commands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', 'new')
  release()
  await Promise.all([first, second])
  expect(PortsStates.get(1).newState.addPortValue).toBe('new')
  PortsStates.dispose(1)
  await directState.commands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', 'stale')
  expect(PortsStates.get(1)).toBeUndefined()
})

test('reports unknown commands and supports process RPCs', async () => {
  await expect(directState.commands['Viewlet.executeViewletCommand'](1, 'missing')).rejects.toThrow('Viewlet command not found')
  expect(RendererProcess.isConnected()).toBe(true)
  await RendererProcess.invoke('test', 1)
  expect(processInvoke).toHaveBeenCalledWith('test', 1)
})

test('queues DOM patches and retains shortcut context in the renderer worker', async () => {
  await directState.commands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  const commands = await render2(1, diff2(1))
  expect(processInvoke).toHaveBeenCalledWith('Viewlet.queueCommands', 1, expect.arrayContaining([['Viewlet.setUid', 1, 1]]))
  const patches = processInvoke.mock.calls[0][2] as readonly (readonly unknown[])[]
  expect(patches.some((command: readonly any[]) => command[0] === ViewletCommand.SetFocusContext)).toBe(false)
  expect(commands).toContainEqual(['Viewlet.commitPending', 1, 17])
  await directState.commands['Viewlet.executeViewletCommand'](1, 'handleFocus')
  expect(await render2(1, diff2(1))).toContainEqual(expect.arrayContaining([ViewletCommand.SetFocusContext, 1]))
  await directState.commands['Viewlet.executeViewletCommand'](1, 'handleBlur')
  expect(await render2(1, diff2(1))).toContainEqual(expect.arrayContaining(['Viewlet.unsetAdditionalFocus', 1]))
})

test('includes events after diff and leaves events during queueing for the next frame', async () => {
  const diff = diff2(1)
  await directState.commands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  const { promise, resolve: release } = Promise.withResolvers<number>()
  processInvoke.mockImplementationOnce(() => promise)
  const rendering = render2(1, diff)
  await directState.commands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', '4000')
  release(18)
  await rendering
  expect(PortsStates.get(1).newState.addPortValue).toBe('4000')
  expect(diff2(1).length).toBeGreaterThan(0)
  await render2(1, diff2(1))
  expect(await render2(1, [])).toEqual([])
})

test('restores the render baseline after queue failure without dropping newer input', async () => {
  const baseline = PortsStates.get(1).oldState
  await directState.commands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  processInvoke.mockRejectedValueOnce(new Error('queue failed'))
  await expect(render2(1, diff2(1))).rejects.toThrow('queue failed')
  expect(PortsStates.get(1).oldState).toBe(baseline)
  expect(PortsStates.get(1).newState.editing).toBe(true)
  await render2(1, diff2(1))
})

test('drops queued input when the view is disposed and recreated with the same uid', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  const started = Promise.withResolvers<void>()
  PortsStates.registerCommands({
    'Ports.waitForPreviousEvent': PortsStates.wrapSerialCommand(async (state) => {
      started.resolve()
      await promise
      return state
    }),
  })
  const previous = directState.commands['Viewlet.executeViewletCommand'](1, 'waitForPreviousEvent')
  await started.promise
  const stale = directState.commands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', 'stale')
  PortsStates.dispose(1)
  const recreated = createTestState({ loaded: true })
  PortsStates.set(1, recreated, recreated)
  resolve()
  await Promise.all([previous, stale])
  expect(PortsStates.get(1).newState.addPortValue).toBe('')
})

test('secondary ports preserve the renderer-process connection used for patch commits', async () => {
  const secondaryInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>().mockResolvedValue(99)
  createRpc.mockResolvedValueOnce({ invoke: secondaryInvoke })
  await commandMap['Ports.handleMessagePort']({} as MessagePort, false)
  await directState.commands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  await render2(1, diff2(1))
  expect(processInvoke).toHaveBeenCalledWith('Viewlet.queueCommands', 1, expect.any(Array))
  expect(secondaryInvoke).not.toHaveBeenCalled()
})
