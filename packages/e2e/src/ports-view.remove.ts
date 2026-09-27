import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ Command, expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  // Preserve the local row-edit fixture; SSH forwarding is covered separately.
  await Command.execute('Ports.loadContent', '')
  const portCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(2)')
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  await Ports.removePort(3000)
  const rows = Ports.rows()
  await expect(rows).toHaveCount(1)
  await expect(portCell0).toHaveText('5173')
}
