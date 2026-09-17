import type { PortInput } from '../PortInput/PortInput.ts'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as NormalizePort from '../NormalizePort/NormalizePort.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export const setPorts = (state: PortsState, ports: readonly PortInput[]): PortsState => {
  const { focusedIndex: oldFocusedIndex } = state
  const normalized = NormalizePort.normalizePorts(ports)
  const focusedIndex = Math.min(oldFocusedIndex, normalized.length - 1)
  return RecalculateVirtualList.recalculateVirtualList({
    ...state,
    focusedIndex,
    loaded: true,
    ports: normalized,
  })
}
