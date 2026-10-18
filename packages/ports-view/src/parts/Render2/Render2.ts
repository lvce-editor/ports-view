import { ViewletCommand } from '@lvce-editor/constants'
import type { PortsState } from '../PortsState/PortsState.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as PortsStates from '../PortsStates/PortsStates.ts'
import * as RenderCss from '../RenderCss/RenderCss.ts'
import * as RenderDom from '../RenderDom/RenderDom.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as RenderFocus from '../RenderFocus/RenderFocus.ts'
import * as RenderFocusContext from '../RenderFocusContext/RenderFocusContext.ts'
import * as RenderIncremental from '../RenderIncremental/RenderIncremental.ts'

type Renderer = (oldState: PortsState, newState: PortsState) => readonly any[]

const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderCss:
      return RenderCss.renderCss
    case DiffType.RenderDom:
      return RenderDom.renderDom
    case DiffType.RenderFocus:
      return RenderFocus.renderFocus
    case DiffType.RenderFocusContext:
      return RenderFocusContext.renderFocusContext
    case DiffType.RenderIncremental:
      return RenderIncremental.renderIncremental
    default:
      throw new Error(`Unknown diff type ${diffType}`)
  }
}

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] | Promise<readonly any[]> => {
  // An event may arrive between diff and render; include its changes in this snapshot.
  const pendingDiffs = [...new Set([...diffResult, ...Diff2.diff2(uid)])]
  const { oldState, scheduledState } = PortsStates.get(uid)
  const commands = pendingDiffs.map((diffType) => getRenderer(diffType)(oldState, scheduledState)).filter((command) => command.length > 0)
  PortsStates.set(uid, scheduledState, scheduledState)
  if (!RendererProcess.isConnected() || commands.length === 0) {
    return commands
  }
  return renderDirect(uid, commands, oldState, scheduledState)
}

const isWorkerCommand = (command: readonly any[]): boolean =>
  command[0] === ViewletCommand.SetFocusContext || command[0] === 'Viewlet.unsetAdditionalFocus'

const renderDirect = async (uid: number, commands: readonly any[], oldState: PortsState, renderedState: PortsState): Promise<readonly any[]> => {
  const workerCommands = commands.filter(isWorkerCommand)
  const processCommands = commands.filter((command) => !isWorkerCommand(command))
  try {
    const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, [...processCommands, ['Viewlet.setUid', uid, uid]])
    return [...workerCommands, ['Viewlet.commitPending', uid, transactionId]]
  } catch (error) {
    const current = PortsStates.get(uid)
    if (current?.oldState === renderedState) {
      PortsStates.set(uid, oldState, current.newState, current.scheduledState)
    }
    throw error
  }
}
