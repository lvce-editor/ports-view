import { mergeClassNames, text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

export const getPortsStatusVirtualDom = (active: boolean, port: number): readonly VirtualDomNode[] => {
  const label = active ? PortsStrings.portIsActive(port) : PortsStrings.portIsInactive(port)
  const stateClass = active ? ClassNames.PortsStatusIconActive : ClassNames.PortsStatusIconInactive
  return [
    {
      ariaLabel: label,
      childCount: 1,
      className: ClassNames.PortsStatusButton,
      name: `port-status-${port}`,
      title: label,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.PortsStatusIcon, stateClass),
      name: `port-status-${port}`,
      type: VirtualDomElements.Span,
    },
    text(active ? '●' : '○'),
  ]
}
