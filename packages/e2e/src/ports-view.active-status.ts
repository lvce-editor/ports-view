import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' }])
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 3000 is active')
  await expect(Ports.activeIcon(0)).toBeVisible()
}
