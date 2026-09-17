import type { PortsState } from '../PortsState/PortsState.ts'

export const handleFocus = (state: PortsState): PortsState => {
  return {
    ...state,
    focused: true,
  }
}
