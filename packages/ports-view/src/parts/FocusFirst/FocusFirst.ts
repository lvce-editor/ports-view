import type { PortsState } from '../PortsState/PortsState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusFirst = (state: PortsState): PortsState => {
  return FocusIndex.focusIndex(state, 0)
}
