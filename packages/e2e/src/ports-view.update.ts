import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [{ forwardedAddress: 'localhost:3000', port: 3000, runningProcess: 'node' }])
  await Command.execute('Ports.setPorts', [{ forwardedAddress: 'localhost:3001', port: 3001, runningProcess: 'python' }])
  const row = Locator('.PortsTableBody .PortsTableRow')
  await expect(row).toHaveCount(1)
  await expect(row.locator('.PortsPortColumn')).toHaveText('3001')
  await expect(row.locator('.PortsProcessColumn')).toHaveText('python')
}
