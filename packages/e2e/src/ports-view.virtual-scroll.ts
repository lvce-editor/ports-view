import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  const ports = Array.from({ length: 1000 }, (_, index) => ({ port: index + 1 }))
  await Command.execute('Ports.setPorts', ports)
  await Command.execute('Ports.setDeltaY', 12_000)
  const firstRenderedPort = Locator('.PortsTableBody .PortsPortColumn').first()
  await expect(firstRenderedPort).toHaveText('501')
}
