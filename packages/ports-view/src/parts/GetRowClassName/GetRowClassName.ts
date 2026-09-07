import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import type { VisiblePort } from '../VisiblePort/VisiblePort.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getRowClassName = (port: VisiblePort): string => {
  let className = ClassNames.PortsTableRow
  if (port.index % 2 === 1) {
    className = mergeClassNames(className, ClassNames.PortsTableRowOdd)
  }
  if (port.selected) {
    className = mergeClassNames(className, ClassNames.Focused)
  }
  return className
}
