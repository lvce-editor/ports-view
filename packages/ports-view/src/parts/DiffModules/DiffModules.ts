import type { PortsState } from '../PortsState/PortsState.ts'

export const isDomEqual = (oldState: PortsState, newState: PortsState): boolean => {
  return (
    oldState.addPortError === newState.addPortError &&
    oldState.addPortValue === newState.addPortValue &&
    oldState.editing === newState.editing &&
    oldState.focusedIndex === newState.focusedIndex &&
    oldState.loaded === newState.loaded &&
    oldState.maxLineY === newState.maxLineY &&
    oldState.minLineY === newState.minLineY &&
    oldState.ports === newState.ports
  )
}

export const isCssEqual = (oldState: PortsState, newState: PortsState): boolean => {
  return (
    oldState.loaded &&
    oldState.deltaY % oldState.itemHeight === newState.deltaY % newState.itemHeight &&
    oldState.footerHeight === newState.footerHeight &&
    oldState.headerHeight === newState.headerHeight &&
    oldState.height === newState.height &&
    oldState.itemHeight === newState.itemHeight &&
    oldState.width === newState.width
  )
}
