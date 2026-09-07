import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

const addButton: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.AddPortButton,
  onClick: DomEventListenerFunctions.HandleStartAddPort,
  type: VirtualDomElements.Button,
}

const addButtonDom: readonly VirtualDomNode[] = [addButton, text('Add Port')]

const footer: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.PortsFooter,
  type: VirtualDomElements.Div,
}

const footerContent: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.Div,
}

export const getPortsFooterVirtualDom = (state: PortsState): readonly VirtualDomNode[] => {
  const { editing } = state
  const content = editing ? GetEditor.getEditor(state) : addButtonDom
  return [footer, footerContent, ...content]
}
