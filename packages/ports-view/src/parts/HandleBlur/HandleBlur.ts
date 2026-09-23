import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetVisiblePorts from '../GetVisiblePorts/GetVisiblePorts.ts'

export const handleBlur = (state: PortsState): PortsState => {
  const updated: PortsState = {
    ...state,
    focused: false,
    focusedIndex: -1,
  }
  return {
    ...updated,
    visiblePorts: GetVisiblePorts.getVisiblePorts(updated),
  }
}
