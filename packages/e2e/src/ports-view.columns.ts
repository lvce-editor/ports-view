import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Ports')
  const headers = Locator('.PortsTableHeader .PortsTableCell')
  await expect(headers).toHaveCount(5)
  const portHeader = headers.nth(1)
  const addressHeader = headers.nth(2)
  const processHeader = headers.nth(3)
  const originHeader = headers.nth(4)
  await expect(portHeader).toHaveText('Port')
  await expect(addressHeader).toHaveText('Forwarded Address')
  await expect(processHeader).toHaveText('Running Process')
  await expect(originHeader).toHaveText('Origin')
}
