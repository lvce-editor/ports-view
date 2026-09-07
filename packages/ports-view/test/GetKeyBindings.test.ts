import { expect, test } from '@jest/globals'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('registers standard keybindings for all ports shortcuts', () => {
  const bindings = getKeyBindings()
  expect(bindings).toEqual([
    { command: 'Ports.focusNext', key: KeyCode.DownArrow, when: WhenExpression.FocusPorts },
    { command: 'Ports.focusPrevious', key: KeyCode.UpArrow, when: WhenExpression.FocusPorts },
    { command: 'Ports.focusFirst', key: KeyCode.Home, when: WhenExpression.FocusPorts },
    { command: 'Ports.focusLast', key: KeyCode.End, when: WhenExpression.FocusPorts },
    { command: 'Ports.startAddPort', key: KeyCode.KeyA, when: WhenExpression.FocusPorts },
    { command: 'Ports.startAddPort', key: KeyCode.KeyA | KeyModifier.Shift, when: WhenExpression.FocusPorts },
    { command: 'Ports.openFocusedAddress', key: KeyCode.Enter, when: WhenExpression.FocusPorts },
    { command: 'Ports.toggleFocusedPort', key: KeyCode.Space, when: WhenExpression.FocusPorts },
    { command: 'Ports.removeFocusedPort', key: KeyCode.Delete, when: WhenExpression.FocusPorts },
    { command: 'Ports.removeFocusedPort', key: KeyCode.Backspace, when: WhenExpression.FocusPorts },
  ])
  expect(commandMap['Ports.getKeyBindings']).toBe(getKeyBindings)
  for (const { command } of bindings) {
    expect(Object.keys(commandMap)).toContain(command)
  }
})
