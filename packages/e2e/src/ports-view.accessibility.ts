import type { Test } from '@lvce-editor/test-with-playwright'

// export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' }])
  const table = Ports.root()
  await expect(table).toHaveAttribute('role', 'table')
  await expect(table).toHaveAttribute('aria-label', 'Ports')
  const row = Ports.rows()
  await expect(row).toHaveAttribute('role', 'row')
  await expect(Ports.addressLink(0)).toHaveAttribute('role', 'link')
}
