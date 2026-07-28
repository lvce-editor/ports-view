import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  const process = 'node /workspace/packages/server/src/very-long-running-process-name.js'
  await Command.execute('Ports.setPorts', [{ origin: 'Auto Forwarded by Remote Environment', port: 3000, runningProcess: process }])
  const processCell = Locator('.PortsProcessColumn').nth(1)
  await expect(processCell).toHaveAttribute('title', process)
  const originCell = Locator('.PortsOriginColumn').nth(1)
  await expect(originCell).toHaveAttribute('title', 'Auto Forwarded by Remote Environment')
}
