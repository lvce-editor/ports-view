import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetPortsVirtualDom from '../GetPortsVirtualDom/GetPortsVirtualDom.ts'

export const renderIncremental = (oldState: PortsState, newState: PortsState): readonly any[] => {
  const oldDom = GetPortsVirtualDom.getPortsVirtualDom(oldState)
  const newDom = GetPortsVirtualDom.getPortsVirtualDom(newState)
  return [ViewletCommand.SetPatches, newState.uid, diffTree(oldDom, newDom)]
}
