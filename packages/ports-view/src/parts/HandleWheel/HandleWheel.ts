import type { PortsState } from '../PortsState/PortsState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

const PageScrollMultiplier = 16

export const handleWheel = (state: PortsState, deltaMode: number, deltaY: number): PortsState => {
  const multiplier = deltaMode === 0 ? 1 : PageScrollMultiplier
  return SetDeltaY.setDeltaY(state, state.deltaY + deltaY * multiplier)
}
