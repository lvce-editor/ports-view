import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

const headerRow: VirtualDomNode = {
  childCount: 5,
  className: ClassNames.PortsTableHeader,
  role: AriaRoles.Row,
  type: VirtualDomElements.Div,
}

const headerCell: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.PortsColumn,
  role: AriaRoles.ColumnHeader,
  type: VirtualDomElements.Div,
}

const getHeaderCell = (label: string): readonly VirtualDomNode[] => {
  return [headerCell, text(label)]
}

export const getPortsTableHeaderVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    headerRow,
    ...getHeaderCell(''),
    ...getHeaderCell(PortsStrings.port()),
    ...getHeaderCell(PortsStrings.forwardedAddress()),
    ...getHeaderCell(PortsStrings.runningProcess()),
    ...getHeaderCell(PortsStrings.origin()),
  ]
}
