import type { PortsState } from '../PortsState/PortsState.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export interface Dimensions {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

export const resize = (state: PortsState, dimensions: Dimensions): PortsState => {
  return RecalculateVirtualList.recalculateVirtualList({
    ...state,
    ...dimensions,
  })
}
