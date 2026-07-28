import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  const ports = Array.from({ length: 1000 }, (_, index) => ({ port: index + 1 }))
  await Command.execute('Ports.setPorts', ports)
  const rows = Locator('.PortsTableBody .PortsTableRow')
  // @ts-ignore test expect supports scalar matchers at runtime
  const renderedCount = await rows.count()
  // @ts-ignore test expect supports scalar matchers at runtime
  expect(renderedCount).toBeLessThan(1000)
  await expect(rows.first()).toBeVisible()
}
