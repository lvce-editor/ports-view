import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { show2 } from '../src/parts/ContextMenu/ContextMenu.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'

test('show2 forwards the context menu request', async () => {
  const args = { href: 'http://localhost:3000', menuId: MenuEntryId.PortsTable } as const
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  await show2(42, MenuEntryId.PortsTable, 100, 200, args)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 42, MenuEntryId.PortsTable, 100, 200, args]])
})
