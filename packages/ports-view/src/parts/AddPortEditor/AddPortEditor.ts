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

export const submitAddPort = (state: PortsState): PortsState => {
  const { addPortValue } = state
  const value = addPortValue.trim()
  const port = Number(value)
  if (!PortRegex.test(value) || !Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    return {
      ...state,
      addPortError: PortsStrings.enterAPortNumberBetween1And65535(),
    }
  }
  return {
    ...AddPort.addPort(state, {
      active: true,
      forwardedAddress: `localhost:${port}`,
      origin: PortsStrings.userForwarded(),
      port,
      runningProcess: '',
    }),
    addPortError: '',
    addPortValue: '',
    editing: false,
  }
}

export const handleAddPortKeyDown = (state: PortsState, key: string): PortsState => {
  if (key === 'Enter') {
    return submitAddPort(state)
  }
  if (key === 'Escape') {
    return cancelAddPort(state)
  }
  return state
}
