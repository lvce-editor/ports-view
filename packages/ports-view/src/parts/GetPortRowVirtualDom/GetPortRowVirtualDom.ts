import { mergeClassNames, text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { VisiblePort } from '../VisiblePort/VisiblePort.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetPortsStatusVirtualDom from '../GetPortsStatusVirtualDom/GetPortsStatusVirtualDom.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const statusCell: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.PortsTableCell, 'PortsStatusColumn'),
  role: AriaRoles.Cell,
  type: VirtualDomElements.Div,
}

const getRowClassName = (port: VisiblePort): string => {
  let className = ClassNames.PortsTableRow
  if (port.index % 2 === 1) {
    className = mergeClassNames(className, ClassNames.PortsTableRowOdd)
  }
  if (port.selected) {
    className = mergeClassNames(className, ClassNames.Focused)
  }
  return className
}

const getTextCell = (value: string, className: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.PortsTableCell, className),
      role: AriaRoles.Cell,
      title: value,
      type: VirtualDomElements.Div,
    },
    text(value),
  ]
}

export const getPortRowVirtualDom = (port: VisiblePort): readonly VirtualDomNode[] => {
  const portText = String(port.port)
  return [
    {
      ariaRowIndex: port.index + 2,
      childCount: 5,
      className: getRowClassName(port),
      role: AriaRoles.Row,
      type: VirtualDomElements.Div,
    },
    statusCell,
    ...GetPortsStatusVirtualDom.getPortsStatusVirtualDom(port.active, port.port),
    ...getTextCell(portText, 'PortsPortColumn'),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.PortsTableCell, 'PortsAddressColumn'),
      role: AriaRoles.Cell,
      title: port.forwardedAddress,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'PortsAddressLink',
      name: `port-address-${port.port}`,
      role: AriaRoles.Link,
      tabIndex: TabIndex.Unfocusable,
      type: VirtualDomElements.A,
    },
    text(port.forwardedAddress),
    ...getTextCell(port.runningProcess, 'PortsProcessColumn'),
    ...getTextCell(port.origin, 'PortsOriginColumn'),
  ]
}
