import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortInput } from '../PortInput/PortInput.ts'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as SetPorts from '../SetPorts/SetPorts.ts'

export const loadContent = async (state: PortsState, workspaceUri = ''): Promise<PortsState> => {
  if (!workspaceUri) {
    return SetPorts.setPorts(state, [])
  }
  const { uid } = state
  const ports: readonly PortInput[] = await RendererWorker.invoke('Application.executeForView', uid, 'PortProvider.getPorts', workspaceUri)
  return SetPorts.setPorts(state, ports)
}
