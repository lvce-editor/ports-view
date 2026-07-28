import type { PortsState } from '../PortsState/PortsState.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export const removePort = (state: PortsState, portNumber: number): PortsState => {
  const ports = state.ports.filter((item) => item.port !== portNumber)
  const focusedIndex = Math.min(state.focusedIndex, ports.length - 1)
  return RecalculateVirtualList.recalculateVirtualList({
    ...state,
    focusedIndex,
    ports,
  })
}
