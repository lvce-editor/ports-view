import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as OpenAddress from '../OpenAddress/OpenAddress.ts'
import * as TogglePortActive from '../TogglePortActive/TogglePortActive.ts'

const parsePort = (name: string): number => {
  return Number(name.slice(name.lastIndexOf('-') + 1))
}

export const handleClick = async (state: PortsState, clientY: number, name: string): Promise<PortsState> => {
  if (name.startsWith('port-address-')) {
    const portNumber = parsePort(name)
    const index = state.ports.findIndex((item) => item.port === portNumber)
    const focused = index === -1 ? state : FocusIndex.focusIndex(state, index)
    return OpenAddress.openAddress(focused, portNumber)
  }
  if (name.startsWith('port-status-')) {
    const portNumber = parsePort(name)
    const index = state.ports.findIndex((item) => item.port === portNumber)
    const focused = index === -1 ? state : FocusIndex.focusIndex(state, index)
    return TogglePortActive.togglePortActive(focused, portNumber)
  }
  return HandleClickAt.handleClickAt(state, clientY, name)
}
