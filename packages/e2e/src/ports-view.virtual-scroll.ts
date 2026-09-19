import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Ports }) => {
  await Ports.open()
  const ports = Array.from({ length: 1000 }, (_, index) => ({
    active: true,
    forwardedAddress: `localhost:${index + 1}`,
    origin: 'User Forwarded',
    port: index + 1,
    runningProcess: '',
  }))
  await Ports.setPorts(ports)
  await Ports.setDeltaY(12_000)
  await expect(Ports.portCell(0)).toHaveText('501')
}
