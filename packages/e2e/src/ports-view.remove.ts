import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  await Ports.removePort(3000)
  const rows = Ports.rows()
  await expect(rows).toHaveCount(1)
  await expect(Ports.portCell(0)).toHaveText('5173')
}
