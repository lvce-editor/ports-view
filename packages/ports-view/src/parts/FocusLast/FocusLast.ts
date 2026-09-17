import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusLast = (state: PortsState): PortsState => {
  const { ports } = state
  return FocusIndex.focusIndex(state, ports.length - 1)
}
