import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([
    { active: true, port: 3000 },
    { active: false, port: 3000 },
  ])
  const rows = Ports.rows()
  await expect(rows).toHaveCount(1)
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 3000 is inactive')
}
