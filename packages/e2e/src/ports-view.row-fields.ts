import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  const portCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(2)')
  const processCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(4)')
  const originCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(5)')
  await Ports.setPorts([{ active: true, forwardedAddress: '127.0.0.1:5173', origin: 'Auto Forwarded', port: 5173, runningProcess: 'vite' }])
  await expect(Ports.rows()).toHaveCount(1)
  await expect(portCell0).toHaveText('5173')
  await expect(Ports.addressLink(0)).toHaveText('127.0.0.1:5173')
  await expect(processCell0).toHaveText('vite')
  await expect(originCell0).toHaveText('Auto Forwarded')
}
