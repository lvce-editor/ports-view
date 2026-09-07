import type { Test } from '@lvce-editor/test-with-playwright'

// Requires the Ports.getKeyBindings worker configuration in the packaged test app.
export const skip = 1

export const test: Test = async ({ expect, KeyBoard, Ports }) => {
  await Ports.open()
  await Ports.setPorts([{ port: 3000 }, { port: 5173 }])
  const ports = Ports.root()
  // eslint-disable-next-line e2e/no-direct-click -- Focus the table through the Ports page object locator.
  await ports.click()
  await expect(ports).toBeFocused()
  const focused = Ports.focusedPort()
  await KeyBoard.press('ArrowDown')
  await expect(focused).toHaveText('3000')
  await KeyBoard.press('ArrowDown')
  await expect(focused).toHaveText('5173')
  await KeyBoard.press('ArrowUp')
  await expect(focused).toHaveText('3000')
  await KeyBoard.press('End')
  await expect(focused).toHaveText('5173')
  await KeyBoard.press('Home')
  await expect(focused).toHaveText('3000')
  await KeyBoard.press('Space')
  await expect(Ports.statusButton(0)).toHaveAttribute('aria-label', 'Port 3000 is inactive')
  await KeyBoard.press('Delete')
  const portColumn = Ports.portCell(0)
  await expect(portColumn).toHaveText('5173')
  await KeyBoard.press('Backspace')
  const rows = Ports.rows()
  await expect(rows).toHaveCount(0)
  await KeyBoard.press('a')
  const input = Ports.addInput()
  await expect(input).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click -- Focus the input through the Ports page object locator.
  await input.click()
  await input.type('3000')
  await KeyBoard.press('Backspace')
  await expect(input).toHaveValue('300')
  await KeyBoard.press('Escape')
  await expect(input).toBeHidden()
  // eslint-disable-next-line e2e/no-direct-click -- Focus the table through the Ports page object locator.
  await ports.click()
  await KeyBoard.press('Shift+A')
  await expect(input).toBeVisible()
}
