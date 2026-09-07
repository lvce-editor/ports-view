import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortInput } from '../PortInput/PortInput.ts'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'
import * as SetPorts from '../SetPorts/SetPorts.ts'

const requests = new Map<number, object>()

export const loadContent = async (state: PortsState, workspaceUri = ''): Promise<PortsState> => {
  const { uid } = state
  const request = {}
  requests.set(uid, request)
  try {
    const ports: readonly PortInput[] = workspaceUri
      ? await RendererWorker.invoke('Application.executeForView', uid, 'PortProvider.getPorts', workspaceUri)
      : []
    if (requests.get(uid) !== request) {
      return PortsStates.get(uid).newState
    }
    return SetPorts.setPorts(state, ports)
  } finally {
    if (requests.get(uid) === request) {
      requests.delete(uid)
    }
  }
}
