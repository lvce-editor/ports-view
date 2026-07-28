import type { PortsState } from '../PortsState/PortsState.ts'

export const loadContent = (state: PortsState): PortsState => {
  return {
    ...state,
    loaded: true,
  }
}
