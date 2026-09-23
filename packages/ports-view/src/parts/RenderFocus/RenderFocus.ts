import { ViewletCommand } from '@lvce-editor/constants'
import type { PortsState } from '../PortsState/PortsState.ts'

export const renderFocus = (oldState: PortsState, newState: PortsState): readonly any[] => {
  if (oldState.editing === newState.editing) {
    return []
  }
  const selector = newState.editing ? '.AddPortInput' : '.Ports'
  return [ViewletCommand.FocusSelector, newState.uid, selector]
}
