import type { PortsState } from '../PortsState/PortsState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as GetAddressUrl from '../GetAddressUrl/GetAddressUrl.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

const getPortNumber = (state: PortsState, clientY: number, name: string): number | undefined => {
  const { ports } = state
  if (name.startsWith('port-address-') || name.startsWith('port-status-')) {
    const portNumber = Number(name.slice(name.lastIndexOf('-') + 1))
    return ports.some((port) => port.port === portNumber) ? portNumber : undefined
  }
  const index = HandleClickAt.getIndexAt(state, clientY)
  return index === -1 ? undefined : ports[index]?.port
}

export const handleContextMenu = async (state: PortsState, clientX: number, clientY: number, name = ''): Promise<PortsState> => {
  const { ports, uid } = state
  const portNumber = getPortNumber(state, clientY, name)
  if (portNumber === undefined) {
    return state
  }
  const port = ports.find((item) => item.port === portNumber)
  if (!port?.forwardedAddress) {
    return state
  }
  await ContextMenu.show2(uid, MenuEntryId.PortsTable, clientX, clientY, {
    href: GetAddressUrl.getAddressUrl(port.forwardedAddress),
    menuId: MenuEntryId.PortsTable,
  })
  return state
}
