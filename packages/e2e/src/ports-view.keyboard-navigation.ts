import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [{ port: 3000 }, { port: 5173 }])
  await Command.execute('Ports.focusNext')
  let focused = Locator('.PortsTableRow.Focused .PortsPortColumn')
  await expect(focused).toHaveText('3000')
  await Command.execute('Ports.focusNext')
  focused = Locator('.PortsTableRow.Focused .PortsPortColumn')
  await expect(focused).toHaveText('5173')
  await Command.execute('Ports.focusPrevious')
  focused = Locator('.PortsTableRow.Focused .PortsPortColumn')
  await expect(focused).toHaveText('3000')
}
