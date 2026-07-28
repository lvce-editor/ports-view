import type { Port } from '../Port/Port.ts'

export interface VisiblePort extends Port {
  readonly index: number
  readonly selected: boolean
}
