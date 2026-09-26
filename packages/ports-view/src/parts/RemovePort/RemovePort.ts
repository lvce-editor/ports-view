import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as RecalculateVirtualList from '../RecalculateVirtualList/RecalculateVirtualList.ts'

export const removePort = (state: PortsState, portNumber: number): PortsState | Promise<PortsState> => {
  const { focusedIndex: oldFocusedIndex, ports: oldPorts, workspaceUri } = state
  if (workspaceUri.startsWith('remote-ssh://')) {
    return stopRemotePort(state, portNumber)
  }
  return updateState(state, oldPorts, oldFocusedIndex, portNumber)
}

const stopRemotePort = async (state: PortsState, portNumber: number): Promise<PortsState> => {
  const { focusedIndex, ports, uid } = state
  try {
    await RendererWorker.invoke('Application.executeForView', uid, 'PortProvider.stopForwardPort', portNumber)
  } catch (error) {
    return {
      ...state,
      addPortError: error instanceof Error ? error.message : String(error),
      editing: true,
    }
  }
  return updateState(state, ports, focusedIndex, portNumber)
}

const updateState = (state: PortsState, oldPorts: PortsState['ports'], oldFocusedIndex: number, portNumber: number): PortsState => {
  const ports = oldPorts.filter((item) => item.port !== portNumber)
  const focusedIndex = Math.min(oldFocusedIndex, ports.length - 1)
  return RecalculateVirtualList.recalculateVirtualList({
    ...state,
    focusedIndex,
    ports,
  })
}
