import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetErrorDom from '../GetErrorDom/GetErrorDom.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

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
      ariaLabel: PortsStrings.portNumber(),
      childCount: 0,
      className: ClassNames.AddPortInput,
      inputMode: 'numeric',
      onInput: DomEventListenerFunctions.HandleAddPortInput,
      onKeyDown: DomEventListenerFunctions.HandleAddPortKeyDown,
      placeholder: PortsStrings.portNumber(),
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
    text(PortsStrings.add()),
    cancelButton,
    text(PortsStrings.cancel()),
    ...GetErrorDom.getErrorDom(addPortError),
  ]
}
