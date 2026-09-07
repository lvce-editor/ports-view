import type { PortsState } from '../PortsState/PortsState.ts'
import * as TogglePortActive from '../TogglePortActive/TogglePortActive.ts'

export const toggleFocusedPort = (state: PortsState): PortsState => {
  const { editing, focusedIndex, ports } = state
  const selected = ports[focusedIndex]
  if (editing || !selected) {
    return state
  }
  return TogglePortActive.togglePortActive(state, selected.port)
}
