import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ port: 3000 }, { port: 5173 }])
  await Ports.focusNext()
  await expect(Ports.focusedPort()).toHaveText('3000')
  await Ports.focusNext()
  await expect(Ports.focusedPort()).toHaveText('5173')
  await Ports.focusPrevious()
  await expect(Ports.focusedPort()).toHaveText('3000')
}
