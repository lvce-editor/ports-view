import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.startAddPort()
  const input = Ports.addInput()
  await expect(input).toBeVisible()
  await Ports.cancelAddPort()
  await expect(input).toHaveCount(0)
  const addButton = Ports.addButton()
  await expect(addButton).toHaveText('Add Port')
}
