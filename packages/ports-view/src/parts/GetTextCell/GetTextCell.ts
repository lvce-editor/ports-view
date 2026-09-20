import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getTextCell = (value: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.PortsColumn,
      role: AriaRoles.Cell,
      title: value,
      type: VirtualDomElements.Div,
    },
    text(value),
  ]
}
