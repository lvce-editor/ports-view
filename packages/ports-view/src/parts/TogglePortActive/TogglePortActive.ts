import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetVisiblePorts from '../GetVisiblePorts/GetVisiblePorts.ts'

export const togglePortActive = (state: PortsState, portNumber: number): PortsState => {
  const { ports } = state
  const updated: PortsState = {
    ...state,
    ports: ports.map((item) => {
      if (item.port !== portNumber) {
        return item
      }
      return {
        ...item,
        active: !item.active,
      }
    }),
  }
  return {
    ...updated,
    visiblePorts: GetVisiblePorts.getVisiblePorts(updated),
  }
}
