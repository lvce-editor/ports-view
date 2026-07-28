import { ViewletCommand } from '@lvce-editor/constants'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetCss from '../GetCss/GetCss.ts'

export const renderCss = (oldState: PortsState, newState: PortsState): readonly any[] => {
  return [ViewletCommand.SetCss, newState.uid, GetCss.getCss(newState)]
}
