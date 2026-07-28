import type { PortsState } from '../PortsState/PortsState.ts'

export const handleBlur = (state: PortsState): PortsState => {
  return {
    ...state,
    focusedIndex: -1,
  }
}
