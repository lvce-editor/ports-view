import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const addButton: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.AddPortButton,
  onClick: DomEventListenerFunctions.HandleStartAddPort,
  type: VirtualDomElements.Button,
}

const addButtonDom: readonly VirtualDomNode[] = [addButton, text('Add Port')]

const cancelButton: VirtualDomNode = {
  childCount: 1,
  className: 'CancelAddPortButton',
  onClick: DomEventListenerFunctions.HandleCancelAddPort,
  type: VirtualDomElements.Button,
}

const footer: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.PortsFooter,
  type: VirtualDomElements.Div,
}

const footerContent: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.Div,
}

const errorMessage: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.AddPortError,
  role: AriaRoles.Alert,
  type: VirtualDomElements.Div,
}

const getErrorDom = (addPortError: string): readonly VirtualDomNode[] => {
  if (!addPortError) {
    return []
  }
  return [errorMessage, text(addPortError)]
}

const getEditor = (state: PortsState): readonly VirtualDomNode[] => {
  const { addPortError, addPortValue } = state
  return [
    {
      childCount: addPortError ? 4 : 3,
      className: ClassNames.AddPortEditor,
      type: VirtualDomElements.Div,
    },
    {
      ariaLabel: 'Port number',
      childCount: 0,
      className: ClassNames.AddPortInput,
      inputMode: 'numeric',
      onInput: DomEventListenerFunctions.HandleAddPortInput,
      onKeyDown: DomEventListenerFunctions.HandleAddPortKeyDown,
      placeholder: 'Port number',
      type: VirtualDomElements.Input,
      value: addPortValue,
    },
    {
      childCount: 1,
      className: ClassNames.AddPortButton,
      disabled: addPortValue.length === 0,
      onClick: DomEventListenerFunctions.HandleSubmitAddPort,
      type: VirtualDomElements.Button,
    },
    text('Add'),
    cancelButton,
    text('Cancel'),
    ...getErrorDom(addPortError),
  ]
}

export const getPortsFooterVirtualDom = (state: PortsState): readonly VirtualDomNode[] => {
  const { editing } = state
  const content = editing ? getEditor(state) : addButtonDom
  return [footer, footerContent, ...content]
}
