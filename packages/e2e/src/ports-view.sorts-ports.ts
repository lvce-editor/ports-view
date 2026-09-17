import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ port: 9000 }, { port: 3000 }, { port: 5173 }])
  await expect(Ports.portCell(0)).toHaveText('3000')
  await expect(Ports.portCell(1)).toHaveText('5173')
  await expect(Ports.portCell(2)).toHaveText('9000')
}
