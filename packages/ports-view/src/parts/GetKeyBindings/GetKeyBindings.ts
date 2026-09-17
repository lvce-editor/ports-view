import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
    {
      command: 'Ports.focusNext',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.focusPrevious',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.focusFirst',
      key: KeyCode.Home,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.focusLast',
      key: KeyCode.End,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.startAddPort',
      key: KeyCode.KeyA,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.startAddPort',
      key: KeyCode.KeyA | KeyModifier.Shift,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.openFocusedAddress',
      key: KeyCode.Enter,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.toggleFocusedPort',
      key: KeyCode.Space,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.removeFocusedPort',
      key: KeyCode.Delete,
      when: WhenExpression.FocusPorts,
    },
    {
      command: 'Ports.removeFocusedPort',
      key: KeyCode.Backspace,
      when: WhenExpression.FocusPorts,
    },
  ]
}
