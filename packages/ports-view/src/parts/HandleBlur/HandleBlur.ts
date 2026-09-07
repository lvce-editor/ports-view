import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const handleBlur = async (state: PortsState): Promise<PortsState> => {
  await RendererWorker.invoke('Focus.removeAdditionalFocus', WhenExpression.FocusPorts)
  return {
    ...state,
    focused: false,
    focusedIndex: -1,
  }
}
