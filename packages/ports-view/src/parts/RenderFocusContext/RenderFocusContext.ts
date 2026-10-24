import { ViewletCommand } from '@lvce-editor/constants'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const renderFocusContext = (oldState: PortsState, newState: PortsState): readonly any[] => {
  if (!newState.focused) {
    const focusContext = oldState.editing ? WhenExpression.FocusPortsAddPort : WhenExpression.FocusPorts
    return ['Viewlet.unsetAdditionalFocus', newState.uid, focusContext]
  }
  return [ViewletCommand.SetFocusContext, newState.uid, newState.editing ? WhenExpression.FocusPortsAddPort : WhenExpression.FocusPorts]
}
