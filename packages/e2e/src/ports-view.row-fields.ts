import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [
    { active: true, forwardedAddress: '127.0.0.1:5173', origin: 'Auto Forwarded', port: 5173, runningProcess: 'vite' },
  ])
  const row = Locator('.PortsTableBody .PortsTableRow')
  await expect(row).toHaveCount(1)
  await expect(row.locator('.PortsPortColumn')).toHaveText('5173')
  await expect(row.locator('.PortsAddressLink')).toHaveText('127.0.0.1:5173')
  await expect(row.locator('.PortsProcessColumn')).toHaveText('vite')
  await expect(row.locator('.PortsOriginColumn')).toHaveText('Auto Forwarded')
}
