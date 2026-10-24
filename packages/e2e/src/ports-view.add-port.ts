import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ Command, expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  // Preserve the local row-edit fixture; SSH forwarding is covered separately.
  await Command.execute('Ports.loadContent', '')
  const portCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(2)')
  await Ports.setPorts([])
  await Ports.addPort('5173')
  await expect(portCell0).toHaveText('5173')
  await expect(Ports.addressLink(0)).toHaveText('localhost:5173')
}
