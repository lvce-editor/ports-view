import type { PortsState } from '../PortsState/PortsState.ts'
import * as OpenAddress from '../OpenAddress/OpenAddress.ts'

export const openFocusedAddress = async (state: PortsState): Promise<PortsState> => {
  const { editing, focusedIndex, ports } = state
  const selected = ports[focusedIndex]
  if (editing || !selected) {
    return state
  }
  return OpenAddress.openAddress(state, selected.port)
}
