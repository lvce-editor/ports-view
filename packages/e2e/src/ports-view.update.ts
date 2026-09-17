import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ forwardedAddress: 'localhost:3000', port: 3000, runningProcess: 'node' }])
  await Ports.setPorts([{ forwardedAddress: 'localhost:3001', port: 3001, runningProcess: 'python' }])
  await expect(Ports.rows()).toHaveCount(1)
  await expect(Ports.portCell(0)).toHaveText('3001')
  await expect(Ports.processCell(0)).toHaveText('python')
}
