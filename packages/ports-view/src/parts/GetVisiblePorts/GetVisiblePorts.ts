import type { PortsState } from '../PortsState/PortsState.ts'
import type { VisiblePort } from '../VisiblePort/VisiblePort.ts'

export const getVisiblePorts = (state: PortsState): readonly VisiblePort[] => {
  const visible: VisiblePort[] = []
  for (let index = state.minLineY; index < state.maxLineY; index++) {
    visible.push({
      ...state.ports[index],
      index,
      selected: index === state.focusedIndex,
    })
  }
  return visible
}
