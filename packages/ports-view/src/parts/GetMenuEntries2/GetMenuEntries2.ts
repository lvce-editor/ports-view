import { MenuItemFlags } from '@lvce-editor/constants'
import type { ContextMenuProps } from '../ContextMenuProps/ContextMenuProps.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'
import * as PortsStrings from '../PortsStrings/PortsStrings.ts'

export const getMenuEntries2 = (_state: PortsState, props: ContextMenuProps): readonly MenuEntry[] => {
  if (props.menuId !== MenuEntryId.PortsTable || !props.href) {
    return []
  }
  return [
    {
      args: [props.href],
      command: 'Ports.copyLink',
      flags: MenuItemFlags.None,
      id: 'copyLink',
      label: PortsStrings.copyLink(),
    },
  ]
}
