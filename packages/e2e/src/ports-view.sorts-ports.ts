import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.setPorts', [{ port: 9000 }, { port: 3000 }, { port: 5173 }])
  const ports = Locator('.PortsPortColumn')
  const first = ports.nth(0)
  const second = ports.nth(1)
  const third = ports.nth(2)
  await expect(first).toHaveText('3000')
  await expect(second).toHaveText('5173')
  await expect(third).toHaveText('9000')
}
