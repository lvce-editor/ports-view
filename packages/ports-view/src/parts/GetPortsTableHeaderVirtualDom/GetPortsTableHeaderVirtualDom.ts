import { mergeClassNames, text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

const headerRow: VirtualDomNode = {
  childCount: 5,
  className: ClassNames.PortsTableHeader,
  role: AriaRoles.Row,
  type: VirtualDomElements.Div,
}

const getHeaderCell = (label: string, className: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.PortsTableCell, className),
      role: AriaRoles.ColumnHeader,
      type: VirtualDomElements.Div,
    },
    text(label),
  ]
}

export const getPortsTableHeaderVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    headerRow,
    ...getHeaderCell('', 'PortsStatusColumn'),
    ...getHeaderCell(PortsStrings.port(), 'PortsPortColumn'),
    ...getHeaderCell(PortsStrings.forwardedAddress(), 'PortsAddressColumn'),
    ...getHeaderCell(PortsStrings.runningProcess(), 'PortsProcessColumn'),
    ...getHeaderCell(PortsStrings.origin(), 'PortsOriginColumn'),
  ]
}
