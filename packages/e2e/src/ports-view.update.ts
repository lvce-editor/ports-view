import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  const portCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(2)')
  const processCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(4)')
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: 'node' }])
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3001', origin: 'User Forwarded', port: 3001, runningProcess: 'python' }])
  await expect(Ports.rows()).toHaveCount(1)
  await expect(portCell0).toHaveText('3001')
  await expect(processCell0).toHaveText('python')
}
