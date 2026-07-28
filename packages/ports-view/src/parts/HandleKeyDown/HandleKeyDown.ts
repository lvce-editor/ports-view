import type { PortsState } from '../PortsState/PortsState.ts'
import * as AddPortEditor from '../AddPortEditor/AddPortEditor.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as OpenAddress from '../OpenAddress/OpenAddress.ts'
import * as RemovePort from '../RemovePort/RemovePort.ts'
import * as TogglePortActive from '../TogglePortActive/TogglePortActive.ts'

export const handleKeyDown = async (state: PortsState, key: string): Promise<PortsState> => {
  if (state.editing) {
    return state
  }
  if (key === 'ArrowDown') {
    return FocusIndex.focusNext(state)
  }
  if (key === 'ArrowUp') {
    return FocusIndex.focusPrevious(state)
  }
  if (key === 'Home') {
    return FocusIndex.focusIndex(state, 0)
  }
  if (key === 'End') {
    return FocusIndex.focusIndex(state, state.ports.length - 1)
  }
  if (key === 'a' || key === 'A') {
    return AddPortEditor.startAddPort(state)
  }
  const selected = state.ports[state.focusedIndex]
  if (!selected) {
    return state
  }
  if (key === 'Enter') {
    return OpenAddress.openAddress(state, selected.port)
  }
  if (key === ' ' || key === 'Spacebar') {
    return TogglePortActive.togglePortActive(state, selected.port)
  }
  if (key === 'Delete' || key === 'Backspace') {
    return RemovePort.removePort(state, selected.port)
  }
  return state
}
