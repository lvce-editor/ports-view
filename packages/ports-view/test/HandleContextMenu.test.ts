import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'
import { setPorts } from '../src/parts/SetPorts/SetPorts.ts'
import { createTestState } from '../src/parts/TestState/TestState.ts'

const stateWithPorts = setPorts(createTestState(), [
  { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
  { active: true, forwardedAddress: 'https://localhost:5173/path', origin: 'User Forwarded', port: 5173, runningProcess: '' },
])

test('handleContextMenu resolves a row from virtualization coordinates', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  await handleContextMenu(stateWithPorts, 100, 28 + 24 + 12, '')

  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      stateWithPorts.uid,
      MenuEntryId.PortsTable,
      100,
      64,
      { href: 'https://localhost:5173/path', menuId: MenuEntryId.PortsTable },
    ],
  ])
})

test('handleContextMenu resolves an address target independently of focus', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  await handleContextMenu(stateWithPorts, 100, 0, 'port-address-3000')

  expect(mockRpc.invocations[0][5]).toEqual({ href: 'http://localhost:3000', menuId: MenuEntryId.PortsTable })
})

test.each([
  ['header', 10, ''],
  ['empty space', 28 + 2 * 24 + 1, ''],
  ['missing port', 0, 'port-address-9999'],
])('handleContextMenu ignores %s', async (_name, clientY, targetName) => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const result = await handleContextMenu(stateWithPorts, 100, clientY, targetName)

  expect(result).toBe(stateWithPorts)
  expect(mockRpc.invocations).toEqual([])
})

test('handleContextMenu ignores ports without forwarded addresses', async () => {
  const state = setPorts(createTestState(), [{ active: true, forwardedAddress: '', origin: 'User Forwarded', port: 3000, runningProcess: '' }])
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  await handleContextMenu(state, 100, 40, '')

  expect(mockRpc.invocations).toEqual([])
})
