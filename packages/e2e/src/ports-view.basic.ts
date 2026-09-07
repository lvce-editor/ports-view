import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ Command, expect, Ports }) => {
  const workerPath = await Command.execute('Preferences.get', 'develop.portsViewPath')
  if (typeof workerPath !== 'string' || !workerPath.replaceAll('\\', '/').endsWith('/.tmp/dist/dist/portsViewWorkerMain.js')) {
    throw new Error(`Expected the local ports view worker, got ${workerPath}`)
  }
  await Ports.open()
  await expect(Ports.root()).toBeVisible()
}
