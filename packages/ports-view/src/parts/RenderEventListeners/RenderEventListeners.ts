import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly any[] => {
  return [
    {
      name: DomEventListenerFunctions.HandleAddPortInput,
      params: ['handleAddPortInput', EventExpression.TargetValue],
    },
    {
      name: DomEventListenerFunctions.HandleAddPortKeyDown,
      params: ['handleAddPortKeyDown', EventExpression.Key],
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
      name: DomEventListenerFunctions.HandleKeyDown,
      params: ['handleKeyDown', EventExpression.Key],
      preventDefault: true,
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
