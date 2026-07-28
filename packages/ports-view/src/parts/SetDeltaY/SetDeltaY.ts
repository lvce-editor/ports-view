import type { PortsState } from '../PortsState/PortsState.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export const setDeltaY = (state: PortsState, deltaY: number): PortsState => {
  return RecalculateVirtualList.recalculateVirtualList({
    ...state,
    deltaY,
  })
}
