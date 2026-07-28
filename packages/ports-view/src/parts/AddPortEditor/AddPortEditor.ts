import type { PortsState } from '../PortsState/PortsState.ts'
import * as AddPort from '../AddPort/AddPort.ts'

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
  const value = state.addPortValue.trim()
  const port = Number(value)
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    return {
      ...state,
      addPortError: 'Enter a port number between 1 and 65535',
    }
  }
  return {
    ...AddPort.addPort(state, { port }),
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
