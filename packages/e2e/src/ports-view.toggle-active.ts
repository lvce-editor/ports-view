import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [{ active: true, port: 3000 }])
  await Command.execute('Ports.togglePortActive', 3000)
  const status = Locator('.PortsStatusButton')
  await expect(status).toHaveAttribute('aria-label', 'Port 3000 is inactive')
}
