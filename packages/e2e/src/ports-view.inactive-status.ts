import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ active: false, port: 3000 }])
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 3000 is inactive')
  await expect(Ports.inactiveIcon(0)).toBeVisible()
}
