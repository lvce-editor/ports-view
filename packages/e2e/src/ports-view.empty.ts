import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([])
  const emptyMessage = Ports.emptyMessage()
  await expect(emptyMessage).toHaveText('No forwarded ports')
}
