import type { PortsState } from '../PortsState/PortsState.ts'
import * as RemovePort from '../RemovePort/RemovePort.ts'

export const removeFocusedPort = (state: PortsState): PortsState => {
  const { editing, focusedIndex, ports } = state
  const selected = ports[focusedIndex]
  if (editing || !selected) {
    return state
  }
  return RemovePort.removePort(state, selected.port)
}
