import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [{ port: 3000 }])
  const table = Locator('.Ports')
  await expect(table).toHaveAttribute('role', 'table')
  await expect(table).toHaveAttribute('aria-label', 'Ports')
  const row = Locator('.PortsTableBody .PortsTableRow')
  await expect(row).toHaveAttribute('role', 'row')
  const address = row.locator('.PortsAddressLink')
  await expect(address).toHaveAttribute('role', 'link')
}
