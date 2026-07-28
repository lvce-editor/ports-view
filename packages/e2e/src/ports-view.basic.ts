import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  const ports = Locator('.Ports')
  await expect(ports).toBeVisible()
}
