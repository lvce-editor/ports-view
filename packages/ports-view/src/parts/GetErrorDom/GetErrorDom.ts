import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const errorMessage: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.AddPortError,
  role: AriaRoles.Alert,
  type: VirtualDomElements.Div,
}

export const getErrorDom = (addPortError: string): readonly VirtualDomNode[] => {
  if (!addPortError) {
    return []
  }
  return [errorMessage, text(addPortError)]
}
