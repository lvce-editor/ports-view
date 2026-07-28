import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [
    { active: true, port: 3000 },
    { active: false, port: 3000 },
  ])
  const rows = Locator('.PortsTableBody .PortsTableRow')
  await expect(rows).toHaveCount(1)
  const status = rows.locator('.PortsStatusButton')
  await expect(status).toHaveAttribute('aria-label', 'Port 3000 is inactive')
}
