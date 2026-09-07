import type { PortsState } from '../PortsState/PortsState.ts'

export const getCss = (state: PortsState): string => {
  const { deltaY, footerHeight, headerHeight, itemHeight } = state
  const relativeY = -(deltaY % itemHeight)
  return `.Ports {
  grid-template-rows: minmax(0, 1fr) ${footerHeight}px;
}

.PortsTable {
  grid-template-rows: ${headerHeight}px minmax(0, 1fr);
}

.PortsTableBody > .PortsTableRow:first-child {
  margin-top: ${relativeY}px;
}

.PortsTableRow {
  height: ${itemHeight}px;
}
`
}
