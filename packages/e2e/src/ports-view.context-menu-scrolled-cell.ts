import type { Test } from '@lvce-editor/test-with-playwright'

export const test: Test = async ({ ClipBoard, ContextMenu, expect, KeyBoard, Locator, Ports, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  await Workspace.setUri('remote-ssh://context-menu-test/workspace')
  await Ports.open()
  const menu = Locator('.Menu')
  const copyLink = Locator('.MenuItem', { hasText: 'Copy Link' })
  await Ports.setPorts(
    Array.from({ length: 1000 }, (_, index) => ({
      active: true,
      forwardedAddress: `localhost:${index + 1}`,
      origin: 'User Forwarded',
      port: index + 1,
      runningProcess: '',
    })),
  )
  await Ports.setDeltaY(12_000)
  const firstPortCell = Locator('.PortsTableBody .PortsTableRow:nth-child(1) .PortsColumn:nth-child(2)')
  await expect(firstPortCell).toHaveText('501')
  // eslint-disable-next-line e2e/no-direct-click -- Exercise coordinate-based targeting on an ordinary cell after scrolling.
  await firstPortCell.click({ button: 'right' })
  await expect(copyLink).toBeVisible()
  await ContextMenu.selectItem('Copy Link')
  await expect(menu).toBeHidden()
  await ClipBoard.shouldHaveText('http://localhost:501')
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 501 is active')

  // Check normal menu dismissal without executing the action.
  await Ports.addressLink(1).dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)
  await expect(menu).toBeVisible()
  await KeyBoard.press('Escape')
  await expect(menu).toBeHidden()
  await ClipBoard.shouldHaveText('http://localhost:501')
}
