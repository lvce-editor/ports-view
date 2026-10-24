import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const getIndexAt = (state: PortsState, clientY: number): number => {
  const { deltaY, headerHeight, itemHeight, listHeight, minLineY, ports, y } = state
  const relativeY = clientY - y - headerHeight
  if (itemHeight <= 0 || relativeY < 0 || relativeY >= listHeight) {
    return -1
  }
  const index = minLineY + Math.floor((relativeY + (deltaY % itemHeight)) / itemHeight)
  if (index < 0 || index >= ports.length) {
    return -1
  }
  return index
}

export const handleClickAt = (state: PortsState, clientY: number): PortsState => {
  const index = getIndexAt(state, clientY)
  if (index === -1) {
    return state
  }
  return FocusIndex.focusIndex(state, index)
}
