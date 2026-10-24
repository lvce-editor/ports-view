import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PortsState } from '../PortsState/PortsState.ts'

export const copyLink = async (state: PortsState, href: string): Promise<PortsState> => {
  await RendererWorker.writeClipBoardText(href)
  return state
}
