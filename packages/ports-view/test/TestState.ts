import type { PortsState } from '../src/parts/PortsState/PortsState.ts'

export const createTestState = (overrides: Partial<PortsState> = {}): PortsState => {
  return {
    addPortError: '',
    addPortValue: '',
    deltaY: 0,
    editing: false,
    finalDeltaY: 0,
    focusedIndex: -1,
    footerHeight: 36,
    headerHeight: 28,
    height: 160,
    itemHeight: 24,
    listHeight: 96,
    loaded: true,
    maxLineY: 0,
    minLineY: 0,
    platform: 1,
    ports: [],
    scrollBarHeight: 0,
    scrollBarY: 0,
    uid: 1,
    width: 800,
    x: 0,
    y: 0,
    ...overrides,
  }
}
