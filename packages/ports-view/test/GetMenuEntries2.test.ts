import { expect, test } from '@jest/globals'
import { MenuItemFlags } from '@lvce-editor/constants'
import { getMenuEntries2 } from '../src/parts/GetMenuEntries2/GetMenuEntries2.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'
import { createTestState } from '../src/parts/TestState/TestState.ts'

test('getMenuEntries2 exposes Copy Link for a forwarded address', () => {
  const entries = getMenuEntries2(createTestState(), {
    href: 'http://localhost:3000',
    menuId: MenuEntryId.PortsTable,
  })

  expect(entries).toEqual([
    {
      args: ['http://localhost:3000'],
      command: 'Ports.copyLink',
      flags: MenuItemFlags.None,
      id: 'copyLink',
      label: 'Copy Link',
    },
  ])
})

test('getMenuEntries2 returns no actions without a link', () => {
  expect(getMenuEntries2(createTestState(), { href: '', menuId: MenuEntryId.PortsTable })).toEqual([])
})

test('getMenuEntries2 ignores an unknown menu', () => {
  expect(getMenuEntries2(createTestState(), { href: 'http://localhost:3000', menuId: 999 } as never)).toEqual([])
})
