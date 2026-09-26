import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as AddPort from '../AddPort/AddPort.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

const PortRegex = /^\d+$/

export const startAddPort = (state: PortsState): PortsState => {
  return {
    ...state,
    addPortError: '',
    addPortValue: '',
    editing: true,
  }
}

export const cancelAddPort = (state: PortsState): PortsState => {
  return {
    ...state,
    addPortError: '',
    addPortValue: '',
    editing: false,
  }
}

export const handleAddPortInput = (state: PortsState, value: string): PortsState => {
  return {
    ...state,
    addPortError: '',
    addPortValue: value,
  }
}

export const submitAddPort = (state: PortsState): PortsState | Promise<PortsState> => {
  const { addPortValue, workspaceUri } = state
  const value = addPortValue.trim()
  const port = Number(value)
  if (!PortRegex.test(value) || !Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    return {
      ...state,
      addPortError: PortsStrings.enterAPortNumberBetween1And65535(),
    }
  }
  if (!workspaceUri.startsWith('remote-ssh://')) {
    return addPortToState(state, port, port, PortsStrings.userForwarded())
  }
  return forwardRemotePort(state, port)
}

const addPortToState = (state: PortsState, port: number, localPort: number, origin: string): PortsState => {
  const { ports } = state
  const withoutDuplicate = {
    ...state,
    ports: ports.filter((item) => item.port !== port),
  }
  return {
    ...AddPort.addPort(withoutDuplicate, {
      active: true,
      forwardedAddress: `localhost:${localPort}`,
      origin,
      port,
      runningProcess: '',
    }),
    addPortError: '',
    addPortValue: '',
    editing: false,
  }
}

const forwardRemotePort = async (state: PortsState, port: number): Promise<PortsState> => {
  const { uid } = state
  try {
    const forwardedPort = await RendererWorker.invoke('Application.executeForView', uid, 'PortProvider.forwardPort', port)
    if (!forwardedPort || typeof forwardedPort !== 'object' || !('localPort' in forwardedPort)) {
      throw new Error('Remote SSH returned an invalid local forwarding port')
    }
    const { localPort } = forwardedPort
    if (!Number.isSafeInteger(localPort) || Number(localPort) < 1 || Number(localPort) > 65_535) {
      throw new Error('Remote SSH returned an invalid local forwarding port')
    }
    return addPortToState(state, port, Number(localPort), 'Remote SSH')
  } catch (error) {
    return {
      ...state,
      addPortError: error instanceof Error ? error.message : String(error),
      editing: true,
    }
  }
}
