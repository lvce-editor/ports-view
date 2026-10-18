import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

let directCommands: Record<string, (...args: any[]) => Promise<void>>
const processInvoke = jest.fn<(...args: any[]) => Promise<any>>()
const createRpc = jest.fn(async (options: any) => {
  directCommands = options.commandMap
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
const workerInvoke = jest.fn<(...args: any[]) => Promise<any>>()

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
  await directCommands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', '3000')
  expect(PortsStates.get(1).newState.addPortValue).toBe('3000')
  expect(workerInvoke.mock.calls).toEqual([['Viewlet.requestRender', 1]])
  expect(createRpc).toHaveBeenCalledWith(expect.objectContaining({ messagePort: {} }))
})

test('serializes asynchronous work with following input and ignores disposed in-flight work', async () => {
  let release!: () => void
  const pending = new Promise<void>((resolve) => {
    release = resolve
  })
  PortsStates.registerCommands({
    'Ports.wait': PortsStates.wrapSerialCommand(async (state) => {
      await pending
      return { ...state, addPortValue: 'old' }
    }),
  })
  const first = directCommands['Viewlet.executeViewletCommand'](1, 'wait')
  const second = directCommands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', 'new')
  release()
  await Promise.all([first, second])
  expect(PortsStates.get(1).newState.addPortValue).toBe('new')
  PortsStates.dispose(1)
  await directCommands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', 'stale')
  expect(PortsStates.get(1)).toBeUndefined()
})

test('reports unknown commands and supports process RPCs', async () => {
  await expect(directCommands['Viewlet.executeViewletCommand'](1, 'missing')).rejects.toThrow('Viewlet command not found')
  expect(RendererProcess.isConnected()).toBe(true)
  await RendererProcess.invoke('test', 1)
  expect(processInvoke).toHaveBeenCalledWith('test', 1)
})

test('queues DOM patches and retains shortcut context in the renderer worker', async () => {
  await directCommands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  const commands = await render2(1, diff2(1))
  expect(processInvoke).toHaveBeenCalledWith('Viewlet.queueCommands', 1, expect.arrayContaining([['Viewlet.setUid', 1, 1]]))
  const patches = processInvoke.mock.calls[0][2]
  expect(patches.some((command: any[]) => command[0] === ViewletCommand.SetFocusContext)).toBe(false)
  expect(commands).toContainEqual(['Viewlet.commitPending', 1, 17])
  await directCommands['Viewlet.executeViewletCommand'](1, 'handleFocus')
  expect(await render2(1, diff2(1))).toContainEqual(expect.arrayContaining([ViewletCommand.SetFocusContext, 1]))
  await directCommands['Viewlet.executeViewletCommand'](1, 'handleBlur')
  expect(await render2(1, diff2(1))).toContainEqual(expect.arrayContaining(['Viewlet.unsetAdditionalFocus', 1]))
})

test('includes events after diff and leaves events during queueing for the next frame', async () => {
  const diff = diff2(1)
  await directCommands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  let release!: (value: number) => void
  processInvoke.mockImplementationOnce(
    () =>
      new Promise<number>((resolve) => {
        release = resolve
      }),
  )
  const rendering = render2(1, diff)
  await directCommands['Viewlet.executeViewletCommand'](1, 'handleAddPortInput', '4000')
  release(18)
  await rendering
  expect(PortsStates.get(1).newState.addPortValue).toBe('4000')
  expect(diff2(1).length).toBeGreaterThan(0)
  await render2(1, diff2(1))
  expect(await render2(1, [])).toEqual([])
})

test('restores the render baseline after queue failure without dropping newer input', async () => {
  const baseline = PortsStates.get(1).oldState
  await directCommands['Viewlet.executeViewletCommand'](1, 'startAddPort')
  processInvoke.mockRejectedValueOnce(new Error('queue failed'))
  await expect(render2(1, diff2(1))).rejects.toThrow('queue failed')
  expect(PortsStates.get(1).oldState).toBe(baseline)
  expect(PortsStates.get(1).newState.editing).toBe(true)
  await render2(1, diff2(1))
})
