import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { PortsState } from '../PortsState/PortsState.ts'

export const { createDirectEventCommandMap, diff, dispose, get, getCommandIds, registerCommands, set, wrapSerialCommand, wrapGetter } =
  ViewletRegistry.create<PortsState>()
