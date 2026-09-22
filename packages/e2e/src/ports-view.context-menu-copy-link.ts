import type { Test } from '@lvce-editor/test-with-playwright'

// The integrated Ports menu is registered by the lvce-editor consumer and becomes available after its dependency release.
export const skip = 1

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Locator, Ports }) => {
  await ClipBoard.enableMemoryClipBoard()
  await Ports.open()
  await Ports.setPorts([
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'https://localhost:5173/path', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])

  // eslint-disable-next-line e2e/no-direct-click -- Exercise the native context menu on the forwarded address link.
  await Ports.addressLink(1).click({ button: 'right' })

  const menu = Locator('.Menu')
  await expect(menu).toBeVisible()
  const copyLink = Locator('.MenuItem', { hasText: 'Copy Link' })
  await expect(copyLink).toBeVisible()
  await ContextMenu.selectItem('Copy Link')
  await ClipBoard.shouldHaveText('https://localhost:5173/path')
  await expect(Ports.addressLink(1)).toHaveText('https://localhost:5173/path')
}
