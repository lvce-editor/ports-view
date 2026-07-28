import type { PortsState } from '../PortsState/PortsState.ts'

export const togglePortActive = (state: PortsState, portNumber: number): PortsState => {
  return {
    ...state,
    ports: state.ports.map((item) => {
      if (item.port !== portNumber) {
        return item
      }
      return {
        ...item,
        active: !item.active,
      }
    }),
  }
}
