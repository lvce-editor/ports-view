import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Locator, Ports, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  await Workspace.setUri('remote-ssh://context-menu-test/workspace')
  await Ports.open()
  await Ports.setPorts([
    { active: true, forwardedAddress: 'https://localhost:5173/path', origin: 'User Forwarded', port: 5173, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
  ])

  await Ports.focusNext()
  const focusedPort = Locator('.PortsTableRow.Focused .PortsColumn:nth-child(2)')
  await expect(focusedPort).toHaveText('3000')

  // Dispatch contextmenu directly: the legacy click helper also synthesizes a left-click event for button 2.
  await Ports.addressLink(1).dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)

  const menu = Locator('.Menu')
  await expect(menu).toBeVisible()
  const copyLink = Locator('.MenuItem', { hasText: 'Copy Link' })
  await expect(copyLink).toBeVisible()
  await ContextMenu.selectItem('Copy Link')
  await expect(menu).toBeHidden()
  await ClipBoard.shouldHaveText('https://localhost:5173/path')
  await expect(Ports.addressLink(1)).toHaveText('https://localhost:5173/path')
  await expect(Ports.statusButton(1)).toHaveAttribute('aria-label', 'Port 5173 is active')
  const simpleBrowser = Locator('.SimpleBrowser')
  await expect(simpleBrowser).toBeHidden()

  // Verify URL normalization for a scheme-less address.
  await Ports.addressLink(0).dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)
  await expect(copyLink).toBeVisible()
  await ContextMenu.selectItem('Copy Link')
  await expect(menu).toBeHidden()
  await ClipBoard.shouldHaveText('http://localhost:3000')
}
