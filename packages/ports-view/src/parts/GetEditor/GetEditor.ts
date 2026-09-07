import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetErrorDom from '../GetErrorDom/GetErrorDom.ts'

const cancelButton: VirtualDomNode = {
  childCount: 1,
  className: 'CancelAddPortButton',
  onClick: DomEventListenerFunctions.HandleCancelAddPort,
  type: VirtualDomElements.Button,
}

export const getEditor = (state: PortsState): readonly VirtualDomNode[] => {
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
    ...GetErrorDom.getErrorDom(addPortError),
  ]
}
