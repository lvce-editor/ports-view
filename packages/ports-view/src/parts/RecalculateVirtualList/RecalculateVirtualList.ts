import type { PortsState } from '../PortsState/PortsState.ts'
import * as Clamp from '../Clamp/Clamp.ts'

export const recalculateVirtualList = (state: PortsState): PortsState => {
  const { deltaY: oldDeltaY, footerHeight, headerHeight, height, itemHeight, minimumScrollBarSize, ports } = state
  const listHeight = Math.max(0, height - headerHeight - footerHeight)
  const contentHeight = ports.length * itemHeight
  const finalDeltaY = Math.max(0, contentHeight - listHeight)
  const deltaY = Clamp.clamp(oldDeltaY, 0, finalDeltaY)
  const minLineY = itemHeight === 0 ? 0 : Math.floor(deltaY / itemHeight)
  const visibleCount = itemHeight === 0 ? 0 : Math.ceil(listHeight / itemHeight) + 1
  const maxLineY = Math.min(ports.length, minLineY + visibleCount)
  const scrollBarHeight =
    contentHeight <= listHeight || listHeight === 0 ? 0 : Math.max(minimumScrollBarSize, (listHeight * listHeight) / contentHeight)
  const scrollBarY = finalDeltaY === 0 ? 0 : (deltaY / finalDeltaY) * (listHeight - scrollBarHeight)
  return {
    ...state,
    deltaY,
    finalDeltaY,
    listHeight,
    maxLineY,
    minLineY,
    scrollBarHeight,
    scrollBarY,
  }
}
