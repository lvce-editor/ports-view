import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const handleClickAt = (state: PortsState, clientY: number, name: string): PortsState => {
  if (name.startsWith('port-address-') || name.startsWith('port-status-')) {
    const port = Number(name.slice(name.lastIndexOf('-') + 1))
    const index = state.ports.findIndex((item) => item.port === port)
    return index === -1 ? state : FocusIndex.focusIndex(state, index)
  }
  const relativeY = clientY - state.y - state.headerHeight
  const index = state.minLineY + Math.floor((relativeY + (state.deltaY % state.itemHeight)) / state.itemHeight)
  if (relativeY < 0 || index < 0 || index >= state.ports.length) {
    return state
  }
  return FocusIndex.focusIndex(state, index)
}
