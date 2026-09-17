import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ port: 3000 }])
  const table = Ports.root()
  await expect(table).toHaveAttribute('role', 'table')
  await expect(table).toHaveAttribute('aria-label', 'Ports')
  const row = Ports.rows()
  await expect(row).toHaveAttribute('role', 'row')
  await expect(Ports.addressLink(0)).toHaveAttribute('role', 'link')
}
