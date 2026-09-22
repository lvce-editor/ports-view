import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { PortsState } from '../PortsState/PortsState.ts'

export const { diff, dispose, get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<PortsState>()
