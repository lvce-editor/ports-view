import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ port: 3000 }, { port: 5173 }])
  await Ports.removePort(3000)
  const rows = Ports.rows()
  await expect(rows).toHaveCount(1)
  await expect(Ports.portCell(0)).toHaveText('5173')
}
