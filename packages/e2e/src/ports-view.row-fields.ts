import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ active: true, forwardedAddress: '127.0.0.1:5173', origin: 'Auto Forwarded', port: 5173, runningProcess: 'vite' }])
  await expect(Ports.rows()).toHaveCount(1)
  await expect(Ports.portCell(0)).toHaveText('5173')
  await expect(Ports.addressLink(0)).toHaveText('127.0.0.1:5173')
  await expect(Ports.processCell(0)).toHaveText('vite')
  await expect(Ports.originCell(0)).toHaveText('Auto Forwarded')
}
