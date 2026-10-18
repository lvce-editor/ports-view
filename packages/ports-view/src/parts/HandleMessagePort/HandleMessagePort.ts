import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as PortsStates from '../PortsStates/PortsStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: PortsStates.createDirectEventCommandMap((uid) => RendererWorker.invoke('Viewlet.requestRender', uid)),
    messagePort: port,
  })
  RendererProcess.set(rpc)
}
