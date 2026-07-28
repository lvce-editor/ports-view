import { ViewletCommand } from '@lvce-editor/constants'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetPortsVirtualDom from '../GetPortsVirtualDom/GetPortsVirtualDom.ts'

export const renderDom = (oldState: PortsState, newState: PortsState): readonly any[] => {
  return [ViewletCommand.SetDom2, newState.uid, GetPortsVirtualDom.getPortsVirtualDom(newState)]
}
