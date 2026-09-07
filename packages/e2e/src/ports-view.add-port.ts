import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([])
  await Ports.addPort('5173')
  await expect(Ports.portCell(0)).toHaveText('5173')
  await expect(Ports.addressLink(0)).toHaveText('localhost:5173')
}
