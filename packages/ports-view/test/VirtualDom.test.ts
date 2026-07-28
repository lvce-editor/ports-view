import { describe, expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import { isCssEqual, isDomEqual } from '../src/parts/DiffModules/DiffModules.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'
import { getPortRowVirtualDom } from '../src/parts/GetPortRowVirtualDom/GetPortRowVirtualDom.ts'
import { getPortsFooterVirtualDom } from '../src/parts/GetPortsFooterVirtualDom/GetPortsFooterVirtualDom.ts'
import { getPortsStatusVirtualDom } from '../src/parts/GetPortsStatusVirtualDom/GetPortsStatusVirtualDom.ts'
import { getPortsTableBodyVirtualDom } from '../src/parts/GetPortsTableBodyVirtualDom/GetPortsTableBodyVirtualDom.ts'
import { getPortsTableHeaderVirtualDom } from '../src/parts/GetPortsTableHeaderVirtualDom/GetPortsTableHeaderVirtualDom.ts'
import { getPortsVirtualDom } from '../src/parts/GetPortsVirtualDom/GetPortsVirtualDom.ts'
import { getVisiblePorts } from '../src/parts/GetVisiblePorts/GetVisiblePorts.ts'
import * as PortsStates from '../src/parts/PortsStates/PortsStates.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'
import { renderDom } from '../src/parts/RenderDom/RenderDom.ts'
import { renderEventListeners } from '../src/parts/RenderEventListeners/RenderEventListeners.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'
import { setPorts } from '../src/parts/SetPorts/SetPorts.ts'
import { createTestState } from './TestState.ts'

describe('virtual dom', () => {
  test('renders the five-column table and all requested fields', () => {
    const state = setPorts(createTestState(), [
      {
        active: false,
        forwardedAddress: 'localhost:5173',
        origin: 'Auto Forwarded',
        port: 5173,
        runningProcess: 'vite',
      },
    ])
    const dom = getPortsVirtualDom(state)
    expect(dom[0]).toMatchObject({ ariaLabel: 'Ports', className: 'Viewlet Ports', role: 'table', tabIndex: 0 })
    expect(dom).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Forwarded Address' }), expect.objectContaining({ text: 'vite' })]))
    expect(dom).toEqual(
      expect.arrayContaining([expect.objectContaining({ text: 'Auto Forwarded' }), expect.objectContaining({ text: 'localhost:5173' })]),
    )
  })

  test('renders active and inactive status icons accessibly', () => {
    expect(getPortsStatusVirtualDom(true, 3000)[0]).toMatchObject({ ariaLabel: 'Port 3000 is active', name: 'port-status-3000' })
    expect(getPortsStatusVirtualDom(false, 3000)[0]).toMatchObject({ ariaLabel: 'Port 3000 is inactive', name: 'port-status-3000' })
  })

  test('renders selected and odd rows', () => {
    const dom = getPortRowVirtualDom({
      active: true,
      forwardedAddress: 'localhost:3000',
      index: 1,
      origin: 'User Forwarded',
      port: 3000,
      runningProcess: 'node',
      selected: true,
    })
    expect(dom[0]).toMatchObject({ className: 'PortsTableRow PortsTableRowOdd Focused', role: 'row' })
  })

  test('renders empty and populated bodies', () => {
    const empty = getPortsTableBodyVirtualDom(createTestState())
    const populated = getPortsTableBodyVirtualDom(setPorts(createTestState(), [{ port: 3000 }]))
    expect(empty).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'No forwarded ports' })]))
    expect(populated[0]).toMatchObject({ ariaRowCount: 2, childCount: 1, role: 'rowgroup' })
  })

  test('renders add button, editor, and validation', () => {
    expect(getPortsFooterVirtualDom(createTestState())).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Add Port' })]))
    const editor = getPortsFooterVirtualDom(createTestState({ addPortError: 'Invalid', addPortValue: '0', editing: true }))
    expect(editor).toEqual(expect.arrayContaining([expect.objectContaining({ ariaLabel: 'Port number', value: '0' })]))
    expect(editor).toEqual(expect.arrayContaining([expect.objectContaining({ role: 'alert' }), expect.objectContaining({ text: 'Invalid' })]))
  })

  test('header contains all labels', () => {
    const header = getPortsTableHeaderVirtualDom()
    expect(header.filter((node) => node.role === 'columnheader')).toHaveLength(5)
    expect(header).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: 'Port' }),
        expect.objectContaining({ text: 'Forwarded Address' }),
        expect.objectContaining({ text: 'Running Process' }),
        expect.objectContaining({ text: 'Origin' }),
      ]),
    )
  })
})

describe('virtualization rendering', () => {
  test('renders only visible items from a thousand ports', () => {
    const ports = Array.from({ length: 1000 }, (_, index) => ({ port: index + 1 }))
    const state = setDeltaY(setPorts(createTestState(), ports), 12_000)
    const visible = getVisiblePorts(state)
    expect(visible).toHaveLength(5)
    expect(visible[0].port).toBe(501)
    expect(getPortsTableBodyVirtualDom(state)[0]).toMatchObject({ ariaRowCount: 1001, childCount: 5 })
  })

  test('css positions partial rows and styles the table', () => {
    const css = getCss(createTestState({ deltaY: 13 }))
    expect(css).toContain('margin-top: -13px')
    expect(css).toContain('grid-template-columns: 42px')
    expect(css).toContain('.PortsStatusIconActive')
  })
})

describe('render protocol', () => {
  test('emits dom, css, and patches commands', () => {
    const oldState = createTestState({ loaded: false })
    const newState = setPorts(createTestState(), [{ port: 3000 }])
    expect(renderDom(oldState, newState)[0]).toBe(ViewletCommand.SetDom2)
    expect(renderCss(oldState, newState)).toEqual([ViewletCommand.SetCss, 1, getCss(newState)])
    expect(renderIncremental(oldState, newState)[0]).toBe(ViewletCommand.SetPatches)
  })

  test('diff helpers cover dom and css state', () => {
    const state = createTestState()
    expect(isDomEqual(state, state)).toBe(true)
    expect(isDomEqual(state, { ...state, editing: true })).toBe(false)
    expect(isCssEqual(state, state)).toBe(true)
    expect(isCssEqual(state, { ...state, width: 900 })).toBe(false)
  })

  test('registers interaction event listeners and commands', () => {
    const listeners = renderEventListeners()
    expect(listeners).toHaveLength(9)
    expect(listeners).toEqual(expect.arrayContaining([expect.objectContaining({ params: ['handleKeyDown', 'event.key'] })]))
    expect(Object.keys(commandMap)).toEqual(expect.arrayContaining(['Ports.create', 'Ports.setPorts', 'Ports.addPort', 'Ports.removePort']))
  })

  test('creates, diffs, and renders registered view state', () => {
    create(77, '', 1, 2, 800, 160, 1, '', 9)
    const initial = PortsStates.get(77).newState
    expect(initial).toMatchObject({ parentUid: 9, uid: 77, x: 1, y: 2 })
    PortsStates.set(77, initial, { ...initial, loaded: true })
    expect(diff2(77)).toEqual([2])
    expect(render2(77, [1, 2, 3]).map((command) => command[0])).toEqual([ViewletCommand.SetCss, ViewletCommand.SetDom2, ViewletCommand.SetPatches])
    expect(() => render2(77, [999])).toThrow('Unknown diff type 999')
  })
})
