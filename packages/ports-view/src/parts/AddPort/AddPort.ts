import type { PortInput } from '../PortInput/PortInput.ts'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as SetPorts from '../SetPorts/SetPorts.ts'

export const addPort = (state: PortsState, port: PortInput): PortsState => {
  return SetPorts.setPorts(state, [...state.ports, port])
}
