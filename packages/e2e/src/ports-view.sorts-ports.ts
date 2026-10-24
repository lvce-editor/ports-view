import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  const portCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(2)')
  const portCell1 = Locator('.PortsTableBody > .PortsTableRow:nth-child(2) > .PortsColumn:nth-child(2)')
  const portCell2 = Locator('.PortsTableBody > .PortsTableRow:nth-child(3) > .PortsColumn:nth-child(2)')
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  await expect(portCell0).toHaveText('3000')
  await expect(portCell1).toHaveText('5173')
  await expect(portCell2).toHaveText('9000')
}
