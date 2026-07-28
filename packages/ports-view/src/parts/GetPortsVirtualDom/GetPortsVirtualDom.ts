import { mergeClassNames, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetPortsFooterVirtualDom from '../GetPortsFooterVirtualDom/GetPortsFooterVirtualDom.ts'
import * as GetPortsTableBodyVirtualDom from '../GetPortsTableBodyVirtualDom/GetPortsTableBodyVirtualDom.ts'
import * as GetPortsTableHeaderVirtualDom from '../GetPortsTableHeaderVirtualDom/GetPortsTableHeaderVirtualDom.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const table: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.PortsTable,
  type: VirtualDomElements.Div,
}

export const getPortsVirtualDom = (state: PortsState): readonly VirtualDomNode[] => {
  const { ports } = state
  return [
    {
      ariaLabel: 'Ports',
      ariaRowCount: ports.length + 1,
      childCount: 3,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Ports),
      onBlur: DomEventListenerFunctions.HandleBlur,
      onClick: DomEventListenerFunctions.HandleClick,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      onWheel: DomEventListenerFunctions.HandleWheel,
      role: AriaRoles.Table,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    table,
    ...GetPortsTableHeaderVirtualDom.getPortsTableHeaderVirtualDom(),
    ...GetPortsTableBodyVirtualDom.getPortsTableBodyVirtualDom(state),
    ...GetPortsFooterVirtualDom.getPortsFooterVirtualDom(state),
  ]
}
