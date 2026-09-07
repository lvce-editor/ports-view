import type { PortsState } from '../PortsState/PortsState.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const focusIndex = (state: PortsState, index: number): PortsState => {
  const { itemHeight, listHeight, ports } = state
  if (ports.length === 0) {
    return {
      ...state,
      focusedIndex: -1,
    }
  }
  const focusedIndex = Clamp.clamp(index, 0, ports.length - 1)
  let { deltaY } = state
  const itemTop = focusedIndex * itemHeight
  const itemBottom = itemTop + itemHeight
  if (itemTop < deltaY) {
    deltaY = itemTop
  } else if (itemBottom > deltaY + listHeight) {
    deltaY = itemBottom - listHeight
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
  const { focusedIndex } = state
  return focusIndex(state, focusedIndex + 1)
}

export const focusPrevious = (state: PortsState): PortsState => {
  const { focusedIndex, ports } = state
  const index = (focusedIndex === -1 ? ports.length : focusedIndex) - 1
  return focusIndex(state, index)
}
