import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [])
  const emptyMessage = Locator('.PortsEmpty')
  await expect(emptyMessage).toHaveText('No forwarded ports')
}
