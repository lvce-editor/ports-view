import type { PortsState } from '../PortsState/PortsState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const handleWheel = (state: PortsState, deltaMode: number, deltaY: number): PortsState => {
  const { deltaY: oldDeltaY, pageScrollMultiplier } = state
  const multiplier = deltaMode === 0 ? 1 : pageScrollMultiplier
  return SetDeltaY.setDeltaY(state, oldDeltaY + deltaY * multiplier)
}
