import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Locator, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  const processCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(4)')
  const originCell0 = Locator('.PortsTableBody > .PortsTableRow:nth-child(1) > .PortsColumn:nth-child(5)')
  const process = 'node /workspace/packages/server/src/very-long-running-process-name.js'
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:3000', origin: 'Auto Forwarded by Remote Environment', port: 3000, runningProcess: process },
  ])
  const processCell = processCell0
  await expect(processCell).toHaveAttribute('title', process)
  const originCell = originCell0
  await expect(originCell).toHaveAttribute('title', 'Auto Forwarded by Remote Environment')
}
