import { mergeClassNames, text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { VisiblePort } from '../VisiblePort/VisiblePort.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetPortsStatusVirtualDom from '../GetPortsStatusVirtualDom/GetPortsStatusVirtualDom.ts'
import * as GetRowClassName from '../GetRowClassName/GetRowClassName.ts'
import * as GetTextCell from '../GetTextCell/GetTextCell.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const statusCell: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.PortsTableCell, 'PortsStatusColumn'),
  role: AriaRoles.Cell,
  type: VirtualDomElements.Div,
}

export const getPortRowVirtualDom = (port: VisiblePort): readonly VirtualDomNode[] => {
  const portText = String(port.port)
  return [
    {
      ariaRowIndex: port.index + 2,
      childCount: 5,
      className: GetRowClassName.getRowClassName(port),
      role: AriaRoles.Row,
      type: VirtualDomElements.Div,
    },
    statusCell,
    ...GetPortsStatusVirtualDom.getPortsStatusVirtualDom(port.active, port.port),
    ...GetTextCell.getTextCell(portText, 'PortsPortColumn'),
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
    ...GetTextCell.getTextCell(port.runningProcess, 'PortsProcessColumn'),
    ...GetTextCell.getTextCell(port.origin, 'PortsOriginColumn'),
  ]
}
