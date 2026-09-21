import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: 'node' }])
  await Ports.setPorts([{ active: true, forwardedAddress: 'localhost:3001', origin: 'User Forwarded', port: 3001, runningProcess: 'python' }])
  await expect(Ports.rows()).toHaveCount(1)
  await expect(Ports.portCell(0)).toHaveText('3001')
  await expect(Ports.processCell(0)).toHaveText('python')
}
