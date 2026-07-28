import { mergeClassNames, text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getPortsStatusVirtualDom = (active: boolean, port: number): readonly VirtualDomNode[] => {
  const state = active ? 'active' : 'inactive'
  const stateClass = active ? ClassNames.PortsStatusIconActive : ClassNames.PortsStatusIconInactive
  return [
    {
      ariaLabel: `Port ${port} is ${state}`,
      childCount: 1,
      className: ClassNames.PortsStatusButton,
      name: `port-status-${port}`,
      title: `Port ${port} is ${state}`,
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
