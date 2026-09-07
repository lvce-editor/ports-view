import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const handleClickAt = (state: PortsState, clientY: number, name: string): PortsState => {
  const { deltaY, headerHeight, itemHeight, minLineY, ports, y } = state
  if (name.startsWith('port-address-') || name.startsWith('port-status-')) {
    const port = Number(name.slice(name.lastIndexOf('-') + 1))
    const index = ports.findIndex((item) => item.port === port)
    return index === -1 ? state : FocusIndex.focusIndex(state, index)
  }
  const relativeY = clientY - y - headerHeight
  const index = minLineY + Math.floor((relativeY + (deltaY % itemHeight)) / itemHeight)
  if (relativeY < 0 || index < 0 || index >= ports.length) {
    return state
  }
  return FocusIndex.focusIndex(state, index)
}
