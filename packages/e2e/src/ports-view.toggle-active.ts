import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ Command, expect, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  // Preserve the local row-edit fixture; SSH forwarding is covered separately.
  await Command.execute('Ports.loadContent', '')
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' }])
  await Ports.togglePortActive(3000)
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 3000 is inactive')
}
