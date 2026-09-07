import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  const ports = Array.from({ length: 1000 }, (_, index) => ({ port: index + 1 }))
  await Ports.setPorts(ports)
  await expect(Ports.row(999)).toHaveCount(0)
  await expect(Ports.row(0)).toBeVisible()
}
