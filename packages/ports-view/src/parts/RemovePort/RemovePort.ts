import type { PortsState } from '../PortsState/PortsState.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export const removePort = (state: PortsState, portNumber: number): PortsState => {
  const { focusedIndex: oldFocusedIndex, ports: oldPorts } = state
  const ports = oldPorts.filter((item) => item.port !== portNumber)
  const focusedIndex = Math.min(oldFocusedIndex, ports.length - 1)
  return RecalculateVirtualList.recalculateVirtualList({
    ...state,
    focusedIndex,
    ports,
  })
}
