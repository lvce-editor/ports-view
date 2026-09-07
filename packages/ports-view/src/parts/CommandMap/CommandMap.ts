import { terminate } from '@lvce-editor/viewlet-registry'
import * as AddPort from '../AddPort/AddPort.ts'
import * as AddPortEditor from '../AddPortEditor/AddPortEditor.ts'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleFocus from '../HandleFocus/HandleFocus.ts'
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
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import * as SetPorts from '../SetPorts/SetPorts.ts'
import * as ToggleFocusedPort from '../ToggleFocusedPort/ToggleFocusedPort.ts'
import * as TogglePortActive from '../TogglePortActive/TogglePortActive.ts'

export const commandMap = {
  'Ports.addPort': PortsStates.wrapCommand(AddPort.addPort),
  'Ports.cancelAddPort': PortsStates.wrapCommand(AddPortEditor.cancelAddPort),
  'Ports.create': Create.create,
  'Ports.diff2': Diff2.diff2,
  'Ports.dispose': PortsStates.dispose,
  'Ports.focusFirst': PortsStates.wrapCommand(FocusFirst.focusFirst),
  'Ports.focusIndex': PortsStates.wrapCommand(FocusIndex.focusIndex),
  'Ports.focusLast': PortsStates.wrapCommand(FocusLast.focusLast),
  'Ports.focusNext': PortsStates.wrapCommand(FocusIndex.focusNext),
  'Ports.focusPrevious': PortsStates.wrapCommand(FocusIndex.focusPrevious),
  'Ports.getCommandIds': PortsStates.getCommandIds,
  'Ports.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Ports.handleAddPortInput': PortsStates.wrapCommand(AddPortEditor.handleAddPortInput),
  'Ports.handleAddPortKeyDown': PortsStates.wrapCommand(AddPortEditor.handleAddPortKeyDown),
  'Ports.handleBlur': PortsStates.wrapCommand(HandleBlur.handleBlur),
  'Ports.handleClick': PortsStates.wrapCommand(HandleClick.handleClick),
  'Ports.handleFocus': PortsStates.wrapCommand(HandleFocus.handleFocus),
  'Ports.handleWheel': PortsStates.wrapCommand(HandleWheel.handleWheel),
  'Ports.handleWorkspaceChange': PortsStates.wrapCommand(LoadContent.loadContent),
  'Ports.loadContent': PortsStates.wrapCommand(LoadContent.loadContent),
  'Ports.openAddress': PortsStates.wrapCommand(OpenAddress.openAddress),
  'Ports.openFocusedAddress': PortsStates.wrapCommand(OpenFocusedAddress.openFocusedAddress),
  'Ports.removeFocusedPort': PortsStates.wrapCommand(RemoveFocusedPort.removeFocusedPort),
  'Ports.removePort': PortsStates.wrapCommand(RemovePort.removePort),
  'Ports.render2': Render2.render2,
  'Ports.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Ports.resize': PortsStates.wrapCommand(Resize.resize),
  'Ports.setDeltaY': PortsStates.wrapCommand(SetDeltaY.setDeltaY),
  'Ports.setPorts': PortsStates.wrapCommand(SetPorts.setPorts),
  'Ports.startAddPort': PortsStates.wrapCommand(AddPortEditor.startAddPort),
  'Ports.submitAddPort': PortsStates.wrapCommand(AddPortEditor.submitAddPort),
  'Ports.terminate': terminate,
  'Ports.toggleFocusedPort': PortsStates.wrapCommand(ToggleFocusedPort.toggleFocusedPort),
  'Ports.togglePortActive': PortsStates.wrapCommand(TogglePortActive.togglePortActive),
}
