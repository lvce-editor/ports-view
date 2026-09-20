import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as OpenAddress from '../OpenAddress/OpenAddress.ts'
import * as TogglePortActive from '../TogglePortActive/TogglePortActive.ts'

export const handleClick = async (state: PortsState, clientY: number, name: string): Promise<PortsState> => {
  const { ports } = state
  const index = HandleClickAt.getIndexAt(state, clientY)
  if (index === -1) {
    return state
  }
  const port = ports[index]
  const focused = FocusIndex.focusIndex(state, index)
  if (name.startsWith('port-address-')) {
    return OpenAddress.openAddress(focused, port.port)
  }
  if (name.startsWith('port-status-')) {
    return TogglePortActive.togglePortActive(focused, port.port)
  }
  return focused
}
