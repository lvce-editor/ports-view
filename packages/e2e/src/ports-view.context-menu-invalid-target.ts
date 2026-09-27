import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Locator, Ports, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  await Workspace.setUri('remote-ssh://context-menu-test/workspace')
  await Ports.open()
  const menu = Locator('.Menu')
  const copyLink = Locator('.MenuItem', { hasText: 'Copy Link' })
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: '', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  // Establish a previous context target before checking invalid targets.
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

  // Dispatch only contextmenu so the legacy click helper cannot toggle the status button.
  await Ports.statusButton(1).dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)
  await expect(menu).toBeHidden()
  // eslint-disable-next-line e2e/no-direct-click -- Headers must not open a port context menu.
  await Locator('.PortsTableHeader .PortsColumn').first().click({ button: 'right' })
  await expect(menu).toBeHidden()
  await Ports.setPorts([])
  await expect(Ports.emptyMessage()).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click -- Removing the rows must also clear possible context targets.
  await Ports.emptyMessage().click({ button: 'right' })
  await expect(menu).toBeHidden()
  await ClipBoard.shouldHaveText('http://localhost:3000')
}
