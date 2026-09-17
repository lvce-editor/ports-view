import type { PortsState } from '../PortsState/PortsState.ts'
import type { VisiblePort } from '../VisiblePort/VisiblePort.ts'

export const getVisiblePorts = (state: PortsState): readonly VisiblePort[] => {
  const { focusedIndex, maxLineY, minLineY, ports } = state
  const visible: VisiblePort[] = []
  for (let index = minLineY; index < maxLineY; index++) {
    visible.push({
      ...ports[index],
      index,
      selected: index === focusedIndex,
    })
  }
  return visible
}
