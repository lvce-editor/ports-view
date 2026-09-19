import type { PortsState } from '../PortsState/PortsState.ts'

export const getCss = (state: PortsState): string => {
  const { deltaY, footerHeight, headerHeight, itemHeight } = state
  const relativeY = -(deltaY % itemHeight)
  return `.Ports {
  flex: 1 1 auto;
}

.PortsTable {
  flex: 1 1 auto;
}

.PortsTableHeader {
  flex: 0 0 ${headerHeight}px;
}

.PortsFooter {
  flex: 0 0 ${footerHeight}px;
}

.PortsTableBody > .PortsTableRow:first-child {
  margin-top: ${relativeY}px;
}

.PortsTableRow {
  height: ${itemHeight}px;
}
`
}
