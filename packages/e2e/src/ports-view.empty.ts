import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ expect, Ports, Workspace }) => {
  await Workspace.setUri('remote-ssh://ports-test/workspace')
  await Ports.open()
  await Ports.setPorts([])
  const emptyMessage = Ports.emptyMessage()
  await expect(emptyMessage).toHaveText('No forwarded ports')
}
