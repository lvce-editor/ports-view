import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  const process = 'node /workspace/packages/server/src/very-long-running-process-name.js'
  await Ports.setPorts([{ origin: 'Auto Forwarded by Remote Environment', port: 3000, runningProcess: process }])
  const processCell = Ports.processCell(0)
  await expect(processCell).toHaveAttribute('title', process)
  const originCell = Ports.originCell(0)
  await expect(originCell).toHaveAttribute('title', 'Auto Forwarded by Remote Environment')
}
