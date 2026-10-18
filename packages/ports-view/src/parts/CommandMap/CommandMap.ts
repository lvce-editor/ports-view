import { terminate } from '@lvce-editor/viewlet-registry'
import * as AddPort from '../AddPort/AddPort.ts'
import * as AddPortEditor from '../AddPortEditor/AddPortEditor.ts'
import * as CopyLink from '../CopyLink/CopyLink.ts'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as GetComponentState from '../GetComponentState/GetComponentState.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries2 from '../GetMenuEntries2/GetMenuEntries2.ts'
import * as GetMenuIds from '../GetMenuIds/GetMenuIds.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import * as HandleFocus from '../HandleFocus/HandleFocus.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleWheel from '../HandleWheel/HandleWheel.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as OpenAddress from '../OpenAddress/OpenAddress.ts'
import * as OpenFocusedAddress from '../OpenFocusedAddress/OpenFocusedAddress.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'
import * as RemoveFocusedPort from '../RemoveFocusedPort/RemoveFocusedPort.ts'
import * as RemovePort from '../RemovePort/RemovePort.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as Resize from '../Resize/Resize.ts'
import * as SetComponentState from '../SetComponentState/SetComponentState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import * as SetPorts from '../SetPorts/SetPorts.ts'
import * as ToggleFocusedPort from '../ToggleFocusedPort/ToggleFocusedPort.ts'
import * as TogglePortActive from '../TogglePortActive/TogglePortActive.ts'

export const commandMap = {
  'Ports.addPort': PortsStates.wrapSerialCommand(AddPort.addPort),
  'Ports.cancelAddPort': PortsStates.wrapSerialCommand(AddPortEditor.cancelAddPort),
  'Ports.copyLink': PortsStates.wrapSerialCommand(CopyLink.copyLink),
  'Ports.create': Create.create,
  'Ports.diff2': Diff2.diff2,
  'Ports.dispose': PortsStates.dispose,
  'Ports.focusFirst': PortsStates.wrapSerialCommand(FocusFirst.focusFirst),
  'Ports.focusIndex': PortsStates.wrapSerialCommand(FocusIndex.focusIndex),
  'Ports.focusLast': PortsStates.wrapSerialCommand(FocusLast.focusLast),
  'Ports.focusNext': PortsStates.wrapSerialCommand(FocusIndex.focusNext),
  'Ports.focusPrevious': PortsStates.wrapSerialCommand(FocusIndex.focusPrevious),
  'Ports.getCommandIds': PortsStates.getCommandIds,
  'Ports.getComponentState': GetComponentState.getComponentState,
  'Ports.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Ports.getMenuEntries2': PortsStates.wrapGetter(GetMenuEntries2.getMenuEntries2),
  'Ports.getMenuIds': GetMenuIds.getMenuIds,
  'Ports.handleAddPortInput': PortsStates.wrapSerialCommand(AddPortEditor.handleAddPortInput),
  'Ports.handleBlur': PortsStates.wrapSerialCommand(HandleBlur.handleBlur),
  'Ports.handleClick': PortsStates.wrapSerialCommand(HandleClick.handleClick),
  'Ports.handleContextMenu': PortsStates.wrapSerialCommand(HandleContextMenu.handleContextMenu),
  'Ports.handleFocus': PortsStates.wrapSerialCommand(HandleFocus.handleFocus),
  'Ports.handleMessagePort': HandleMessagePort.handleMessagePort,
  'Ports.handleWheel': PortsStates.wrapSerialCommand(HandleWheel.handleWheel),
  'Ports.handleWorkspaceChange': PortsStates.wrapSerialCommand(LoadContent.loadContent),
  'Ports.loadContent': PortsStates.wrapSerialCommand(LoadContent.loadContent),
  'Ports.openAddress': PortsStates.wrapSerialCommand(OpenAddress.openAddress),
  'Ports.openFocusedAddress': PortsStates.wrapSerialCommand(OpenFocusedAddress.openFocusedAddress),
  'Ports.removeFocusedPort': PortsStates.wrapSerialCommand(RemoveFocusedPort.removeFocusedPort),
  'Ports.removePort': PortsStates.wrapSerialCommand(RemovePort.removePort),
  'Ports.render2': Render2.render2,
  'Ports.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Ports.resize': PortsStates.wrapSerialCommand(Resize.resize),
  'Ports.setComponentState': SetComponentState.setComponentState,
  'Ports.setDeltaY': PortsStates.wrapSerialCommand(SetDeltaY.setDeltaY),
  'Ports.setPorts': PortsStates.wrapSerialCommand(SetPorts.setPorts),
  'Ports.startAddPort': PortsStates.wrapSerialCommand(AddPortEditor.startAddPort),
  'Ports.submitAddPort': PortsStates.wrapSerialCommand(AddPortEditor.submitAddPort),
  'Ports.terminate': terminate,
  'Ports.toggleFocusedPort': PortsStates.wrapSerialCommand(ToggleFocusedPort.toggleFocusedPort),
  'Ports.togglePortActive': PortsStates.wrapSerialCommand(TogglePortActive.togglePortActive),
}
