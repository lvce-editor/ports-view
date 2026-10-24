import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'
import * as PortsStates from '../src/parts/PortsStates/PortsStates.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import { renderFocus } from '../src/parts/RenderFocus/RenderFocus.ts'
import { renderFocusContext } from '../src/parts/RenderFocusContext/RenderFocusContext.ts'
import { createTestState } from '../src/parts/TestState/TestState.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('enables ports shortcuts when the table receives focus', () => {
  create(88, '', 0, 0, 800, 160, 1, '')
  const oldState = { ...PortsStates.get(88).newState, loaded: true }
  const newState = handleFocus(oldState)
  PortsStates.set(88, oldState, newState)
  expect(diff2(88)).toEqual([DiffType.RenderFocusContext])
  expect(render2(88, diff2(88))).toEqual([[ViewletCommand.SetFocusContext, 88, WhenExpression.FocusPorts]])
})

test('disables table shortcuts while adding a port', () => {
  const state = createTestState({ focused: true })
  expect(renderFocusContext(state, { ...state, editing: true })).toEqual([ViewletCommand.SetFocusContext, 1, WhenExpression.FocusPortsAddPort])
  expect(renderFocusContext({ ...state, editing: true }, state)).toEqual([ViewletCommand.SetFocusContext, 1, WhenExpression.FocusPorts])
})

test('moves focus to the editor and back to the ports table', () => {
  const state = createTestState()
  expect(renderFocus(state, { ...state, editing: true })).toEqual([ViewletCommand.FocusSelector, 1, '.AddPortInput'])
  expect(renderFocus({ ...state, editing: true }, state)).toEqual([ViewletCommand.FocusSelector, 1, '.Ports'])
})

test('removes only the ports context when the table loses focus', () => {
  const state = createTestState()
  expect(renderFocusContext(state, state)).toEqual(['Viewlet.unsetAdditionalFocus', 1, WhenExpression.FocusPorts])
})

test('clears the editing context when the editor loses focus', () => {
  const state = createTestState({ editing: true })
  expect(renderFocusContext(state, { ...state, focused: false })).toEqual(['Viewlet.unsetAdditionalFocus', 1, WhenExpression.FocusPortsAddPort])
})
