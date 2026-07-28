import type { Port } from '../Port/Port.ts'

export interface PortsState {
  readonly addPortError: string
  readonly addPortValue: string
  readonly deltaY: number
  readonly editing: boolean
  readonly finalDeltaY: number
  readonly focusedIndex: number
  readonly footerHeight: number
  readonly headerHeight: number
  readonly height: number
  readonly itemHeight: number
  readonly listHeight: number
  readonly loaded: boolean
  readonly maxLineY: number
  readonly minLineY: number
  readonly parentUid?: number
  readonly platform: number
  readonly ports: readonly Port[]
  readonly scrollBarHeight: number
  readonly scrollBarY: number
  readonly uid: number
  readonly width: number
  readonly x: number
  readonly y: number
}
