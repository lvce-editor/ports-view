import type { PortsState } from '../PortsState/PortsState.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const focusIndex = (state: PortsState, index: number): PortsState => {
  const { ports } = state
  if (ports.length === 0) {
    return {
      ...state,
      focusedIndex: -1,
    }
  }
  const focusedIndex = Clamp.clamp(index, 0, ports.length - 1)
  let { deltaY } = state
  const itemTop = focusedIndex * state.itemHeight
  const itemBottom = itemTop + state.itemHeight
  if (itemTop < deltaY) {
    deltaY = itemTop
  } else if (itemBottom > deltaY + state.listHeight) {
    deltaY = itemBottom - state.listHeight
  }
  return SetDeltaY.setDeltaY(
    {
      ...state,
      focusedIndex,
    },
    deltaY,
  )
}

export const focusNext = (state: PortsState): PortsState => {
  return focusIndex(state, state.focusedIndex + 1)
}

export const focusPrevious = (state: PortsState): PortsState => {
  const { focusedIndex, ports } = state
  const index = (focusedIndex === -1 ? ports.length : focusedIndex) - 1
  return focusIndex(state, index)
}
