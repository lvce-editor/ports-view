import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.startAddPort')
  const input = Locator('.AddPortInput')
  await expect(input).toBeVisible()
  await Command.execute('Ports.cancelAddPort')
  await expect(input).toHaveCount(0)
  const addButton = Locator('.AddPortButton')
  await expect(addButton).toHaveText('Add Port')
}
