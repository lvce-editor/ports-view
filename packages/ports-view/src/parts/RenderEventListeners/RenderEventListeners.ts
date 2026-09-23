import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly any[] => {
  return [
    {
      name: DomEventListenerFunctions.HandleAddPortInput,
      params: ['handleAddPortInput', EventExpression.TargetValue],
    },
    {
      name: DomEventListenerFunctions.HandleBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenerFunctions.HandleCancelAddPort,
      params: ['cancelAddPort'],
    },
    {
      name: DomEventListenerFunctions.HandleClick,
      params: ['handleClick', EventExpression.ClientY, EventExpression.TargetName],
    },
    {
      name: DomEventListenerFunctions.HandleContextMenu,
      params: ['handleContextMenu', EventExpression.ClientX, EventExpression.ClientY, EventExpression.TargetName],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleFocus,
      params: ['handleFocus'],
    },
    {
      name: DomEventListenerFunctions.HandleStartAddPort,
      params: ['startAddPort'],
    },
    {
      name: DomEventListenerFunctions.HandleSubmitAddPort,
      params: ['submitAddPort'],
    },
    {
      name: DomEventListenerFunctions.HandleWheel,
      params: ['handleWheel', EventExpression.DeltaMode, EventExpression.DeltaY],
      passive: true,
    },
  ]
}
