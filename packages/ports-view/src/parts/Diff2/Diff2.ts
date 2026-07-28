import * as DiffModules from '../DiffModules/DiffModules.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { oldState } = PortsStates.get(uid)
  const domDiffType = oldState.loaded ? DiffType.RenderIncremental : DiffType.RenderDom
  return PortsStates.diff(uid, [DiffModules.isDomEqual, DiffModules.isCssEqual], [domDiffType, DiffType.RenderCss])
}
