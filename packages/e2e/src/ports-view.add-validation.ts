import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  await Command.execute('Ports.startAddPort')
  await Command.execute('Ports.handleAddPortInput', '70000')
  await Command.execute('Ports.submitAddPort')
  const error = Locator('.AddPortError')
  await expect(error).toHaveText('Enter a port number between 1 and 65535')
}
