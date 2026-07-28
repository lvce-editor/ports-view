import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [])
  await Command.execute('Ports.startAddPort')
  await Command.execute('Ports.handleAddPortInput', '5173')
  await Command.execute('Ports.submitAddPort')
  const row = Locator('.PortsTableBody .PortsTableRow')
  await expect(row.locator('.PortsPortColumn')).toHaveText('5173')
  await expect(row.locator('.PortsAddressLink')).toHaveText('localhost:5173')
}
