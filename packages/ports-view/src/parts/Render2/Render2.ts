import type { PortsState } from '../PortsState/PortsState.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'
import * as RenderCss from '../RenderCss/RenderCss.ts'
import * as RenderDom from '../RenderDom/RenderDom.ts'
import * as RenderIncremental from '../RenderIncremental/RenderIncremental.ts'

type Renderer = (oldState: PortsState, newState: PortsState) => readonly any[]

const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderCss:
      return RenderCss.renderCss
    case DiffType.RenderDom:
      return RenderDom.renderDom
    case DiffType.RenderIncremental:
      return RenderIncremental.renderIncremental
    default:
      throw new Error(`Unknown diff type ${diffType}`)
  }
}

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] => {
  const { newState, oldState } = PortsStates.get(uid)
  PortsStates.set(uid, newState, newState)
  return diffResult.map((diffType) => getRenderer(diffType)(oldState, newState))
}
