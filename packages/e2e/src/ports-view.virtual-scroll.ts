import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ Command, expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  // Preserve the local row-edit fixture; SSH forwarding is covered separately.
  await Command.execute('Ports.loadContent', '')
  const portCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(2)')
  const ports = Array.from({ length: 1000 }, (_, index) => ({
    active: true,
    forwardedAddress: `localhost:${index + 1}`,
    origin: 'User Forwarded',
    port: index + 1,
    runningProcess: '',
  }))
  await Ports.setPorts(ports)
  await Ports.setDeltaY(12_000)
  await expect(portCell0).toHaveText('501')
  // eslint-disable-next-line e2e/no-direct-click -- Exercise the status control in the scrolled row.
  await Ports.statusButton(0).click()
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 501 is inactive')
}
