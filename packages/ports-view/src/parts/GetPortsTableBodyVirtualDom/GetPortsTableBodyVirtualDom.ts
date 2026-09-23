import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetPortRowVirtualDom from '../GetPortRowVirtualDom/GetPortRowVirtualDom.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

const emptyBody: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.PortsTableBody,
  role: AriaRoles.RowGroup,
  type: VirtualDomElements.Div,
}

const emptyMessage: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.PortsEmpty,
  role: AriaRoles.Status,
  type: VirtualDomElements.Div,
}

export const getPortsTableBodyVirtualDom = (state: PortsState): readonly VirtualDomNode[] => {
  const { loaded, ports, visiblePorts } = state
  if (loaded && ports.length === 0) {
    return [emptyBody, emptyMessage, text(PortsStrings.noForwardedPorts())]
  }
  return [
    {
      ariaRowCount: ports.length + 1,
      childCount: visiblePorts.length,
      className: ClassNames.PortsTableBody,
      role: AriaRoles.RowGroup,
      type: VirtualDomElements.Div,
    },
    ...visiblePorts.flatMap(GetPortRowVirtualDom.getPortRowVirtualDom),
  ]
}
