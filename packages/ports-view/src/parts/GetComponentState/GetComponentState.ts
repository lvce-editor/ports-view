import type { PortsState } from '../PortsState/PortsState.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'

export const getComponentState = (uid: number): PortsState => {
  return PortsStates.get(uid).newState
}
