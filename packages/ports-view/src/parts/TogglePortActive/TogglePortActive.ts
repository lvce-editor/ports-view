import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetVisiblePorts from '../GetVisiblePorts/GetVisiblePorts.ts'

export const togglePortActive = (state: PortsState, portNumber: number): PortsState | Promise<PortsState> => {
  const { ports, workspaceUri } = state
  if (workspaceUri.startsWith('remote-ssh://')) {
    return toggleRemoteSshPort(state, portNumber)
  }
  const updated: PortsState = {
    ...state,
    ports: ports.map((item) => {
      if (item.port !== portNumber) {
        return item
      }
      return {
        ...item,
        active: !item.active,
      }
    }),
  }
  return {
    ...updated,
    visiblePorts: GetVisiblePorts.getVisiblePorts(updated),
  }
}

const toggleRemoteSshPort = async (state: PortsState, portNumber: number): Promise<PortsState> => {
  const { ports, uid } = state
  const port = ports.find((item) => item.port === portNumber)
  if (!port) {
    return state
  }
  const { forwardedAddress: oldForwardedAddress } = port
  let forwardedAddress = oldForwardedAddress
  try {
    if (port.active) {
      await RendererWorker.invoke('Application.executeForView', uid, 'PortProvider.stopForwardPort', portNumber)
    } else {
      const forwardedPort = await RendererWorker.invoke('Application.executeForView', uid, 'PortProvider.forwardPort', portNumber)
      if (!forwardedPort || typeof forwardedPort !== 'object' || !('localPort' in forwardedPort)) {
        throw new Error('Remote SSH returned an invalid local forwarding port')
      }
      if (!Number.isSafeInteger(forwardedPort.localPort) || Number(forwardedPort.localPort) < 1 || Number(forwardedPort.localPort) > 65_535) {
        throw new Error('Remote SSH returned an invalid local forwarding port')
      }
      forwardedAddress = `localhost:${forwardedPort.localPort}`
    }
  } catch (error) {
    return {
      ...state,
      addPortError: error instanceof Error ? error.message : String(error),
      editing: true,
    }
  }
  const updated = {
    ...state,
    ports: ports.map((item) => (item.port === portNumber ? { ...item, active: !item.active, forwardedAddress } : item)),
  }
  return {
    ...updated,
    visiblePorts: GetVisiblePorts.getVisiblePorts(updated),
  }
}
