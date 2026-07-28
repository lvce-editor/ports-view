import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [{ port: 3000 }, { port: 5173 }])
  await Command.execute('Ports.removePort', 3000)
  const rows = Locator('.PortsTableBody .PortsTableRow')
  await expect(rows).toHaveCount(1)
  await expect(rows.locator('.PortsPortColumn')).toHaveText('5173')
}
