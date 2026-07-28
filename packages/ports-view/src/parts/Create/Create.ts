import type { PortsState } from '../PortsState/PortsState.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export const create = (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  platform: number,
  assetDir: string,
  parentUid?: number,
): void => {
  const state: PortsState = {
    addPortError: '',
    addPortValue: '',
    deltaY: 0,
    editing: false,
    finalDeltaY: 0,
    focusedIndex: -1,
    footerHeight: 36,
    headerHeight: 28,
    height,
    itemHeight: 24,
    listHeight: 0,
    loaded: false,
    maxLineY: 0,
    minLineY: 0,
    parentUid,
    platform,
    ports: [],
    scrollBarHeight: 0,
    scrollBarY: 0,
    uid,
    width,
    x,
    y,
  }
  const calculated = RecalculateVirtualList.recalculateVirtualList(state)
  PortsStates.set(uid, calculated, calculated)
}
