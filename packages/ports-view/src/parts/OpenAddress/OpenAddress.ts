import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as GetAddressUrl from '../GetAddressUrl/GetAddressUrl.ts'

export const openAddress = async (state: PortsState, portNumber: number): Promise<PortsState> => {
  const port = state.ports.find((item) => item.port === portNumber)
  if (!port || !port.forwardedAddress) {
    return state
  }
  await RendererWorker.openUri(GetAddressUrl.getAddressUrl(port.forwardedAddress))
  return state
}
