import type { PortsState } from '../PortsState/PortsState.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'

const applyComponentState = (currentState: PortsState, state: PortsState): PortsState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Ports state must be an object')
  }
  const { uid } = state
  const { uid: currentUid } = currentState
  if (uid !== currentUid) {
    throw new Error(`Ports state uid must remain ${currentUid}`)
  }
  return state
}

export const setComponentState = PortsStates.wrapCommand(applyComponentState)
