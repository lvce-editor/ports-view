import type { PortsState } from '../PortsState/PortsState.ts'

const getNewPorts = (ports: readonly Port[]): readonly Port[] => {
  return ports.map((item) => {
    if (item.port !== portNumber) {
      return item
    }
    return {
      ...item,
      active: !item.active,
    }
  })
}

export const togglePortActive = (state: PortsState, portNumber: number): PortsState => {
  const { ports } = state
  return {
    ...state,
    ports: getNewPorts(port, portNumber),
  }
}
