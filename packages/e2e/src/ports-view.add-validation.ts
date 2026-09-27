import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  await Ports.addPort('70000')
  await expect(Ports.addError()).toHaveText('Enter a port number between 1 and 65535')
}
