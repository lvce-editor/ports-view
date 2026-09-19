import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  await expect(Ports.portCell(0)).toHaveText('3000')
  await expect(Ports.portCell(1)).toHaveText('5173')
  await expect(Ports.portCell(2)).toHaveText('9000')
}
