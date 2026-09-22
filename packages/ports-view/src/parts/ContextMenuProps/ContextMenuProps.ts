import type * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export type ContextMenuProps = {
  readonly href: string
  readonly menuId: typeof MenuEntryId.PortsTable
}
