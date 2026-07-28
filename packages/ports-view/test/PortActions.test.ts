import { describe, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { addPort } from '../src/parts/AddPort/AddPort.ts'
import { cancelAddPort, handleAddPortInput, handleAddPortKeyDown, startAddPort, submitAddPort } from '../src/parts/AddPortEditor/AddPortEditor.ts'
import { getAddressUrl } from '../src/parts/GetAddressUrl/GetAddressUrl.ts'
import { handleBlur } from '../src/parts/HandleBlur/HandleBlur.ts'
import { handleClick } from '../src/parts/HandleClick/HandleClick.ts'
import { handleClickAt } from '../src/parts/HandleClickAt/HandleClickAt.ts'
import { handleKeyDown } from '../src/parts/HandleKeyDown/HandleKeyDown.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { openAddress } from '../src/parts/OpenAddress/OpenAddress.ts'
import { removePort } from '../src/parts/RemovePort/RemovePort.ts'
import { setPorts } from '../src/parts/SetPorts/SetPorts.ts'
import { togglePortActive } from '../src/parts/TogglePortActive/TogglePortActive.ts'
import { createTestState } from './TestState.ts'

describe('port mutations', () => {
  test('loads, adds, replaces, removes, and toggles ports', () => {
    const loaded = loadContent(createTestState({ loaded: false }))
    const added = addPort(loaded, { port: 9000 })
    const replaced = addPort(added, { active: false, port: 9000 })
    const toggled = togglePortActive(replaced, 9000)
    const removed = removePort(toggled, 9000)
    expect(loaded.loaded).toBe(true)
    expect(added.ports).toHaveLength(1)
    expect(replaced.ports).toEqual([expect.objectContaining({ active: false, port: 9000 })])
    expect(toggled.ports).toEqual([expect.objectContaining({ active: true, port: 9000 })])
    expect(removed.ports).toEqual([])
  })

  test('ignores unknown toggle and remove targets', () => {
    const state = setPorts(createTestState(), [{ port: 3000 }])
    expect(togglePortActive(state, 9000).ports).toEqual(state.ports)
    expect(removePort(state, 9000).ports).toEqual(state.ports)
  })
})

describe('add port editor', () => {
  test('opens, updates, submits, and closes', () => {
    const opened = startAddPort(createTestState())
    const updated = handleAddPortInput(opened, ' 5173 ')
    const submitted = submitAddPort(updated)
    expect(opened.editing).toBe(true)
    expect(updated.addPortValue).toBe(' 5173 ')
    expect(submitted).toMatchObject({ addPortError: '', addPortValue: '', editing: false })
    expect(submitted.ports).toEqual([expect.objectContaining({ port: 5173 })])
  })

  test.each(['', 'abc', '0', '65536'])('shows validation for %p', (value) => {
    const state = submitAddPort(createTestState({ addPortValue: value, editing: true }))
    expect(state.addPortError).toBe('Enter a port number between 1 and 65535')
    expect(state.editing).toBe(true)
  })

  test('handles enter, escape, and unrelated keys', () => {
    const state = createTestState({ addPortValue: '3000', editing: true })
    expect(handleAddPortKeyDown(state, 'Enter').ports).toHaveLength(1)
    expect(handleAddPortKeyDown(state, 'Escape').editing).toBe(false)
    expect(handleAddPortKeyDown(state, 'Shift')).toBe(state)
    expect(cancelAddPort(state)).toMatchObject({ addPortError: '', addPortValue: '', editing: false })
  })
})

describe('interaction', () => {
  test('selects a row from pointer coordinates and ignores outside clicks', () => {
    const state = setPorts(createTestState({ y: 10 }), [{ port: 3000 }, { port: 5173 }])
    expect(handleClickAt(state, 10 + 28 + 25, '').focusedIndex).toBe(1)
    expect(handleClickAt(state, 0, 'port-status-3000').focusedIndex).toBe(0)
    expect(handleClickAt(state, 0, 'port-address-9999')).toBe(state)
    expect(handleClickAt(state, 0, '')).toBe(state)
  })

  test('clicking status selects and toggles a port', async () => {
    const state = setPorts(createTestState(), [{ port: 3000 }])
    const result = await handleClick(state, 0, 'port-status-3000')
    expect(result.focusedIndex).toBe(0)
    expect(result.ports[0].active).toBe(false)
    expect(await handleClick(state, 0, 'port-status-9999')).not.toBe(state)
  })

  test('address utilities preserve and add schemes', () => {
    expect(getAddressUrl('localhost:3000')).toBe('http://localhost:3000')
    expect(getAddressUrl('https://example.com')).toBe('https://example.com')
  })

  test('opens forwarded addresses', async () => {
    const commandMap = {
      'Main.openUri': async (): Promise<void> => {},
    }
    using mockRpc = RendererWorker.registerMockRpc(commandMap)
    const state = setPorts(createTestState(), [{ forwardedAddress: '127.0.0.1:3000', port: 3000 }])
    await openAddress(state, 3000)
    await handleClick(state, 0, 'port-address-3000')
    expect(mockRpc.invocations).toEqual([
      ['Main.openUri', 'http://127.0.0.1:3000', undefined, undefined],
      ['Main.openUri', 'http://127.0.0.1:3000', undefined, undefined],
    ])
  })

  test('does not open unknown or empty addresses', async () => {
    const commandMap = {
      'Main.openUri': async (): Promise<void> => {},
    }
    using mockRpc = RendererWorker.registerMockRpc(commandMap)
    await openAddress(createTestState(), 3000)
    await openAddress(setPorts(createTestState(), [{ forwardedAddress: '', port: 3000 }]), 3000)
    expect(mockRpc.invocations).toEqual([])
  })

  test('keyboard navigation, activation, deletion, and add shortcut', async () => {
    const state = setPorts(createTestState(), [{ port: 3000 }, { port: 5173 }])
    const down = await handleKeyDown(state, 'ArrowDown')
    const toggled = await handleKeyDown(down, ' ')
    const removed = await handleKeyDown(toggled, 'Delete')
    expect(down.focusedIndex).toBe(0)
    expect(toggled.ports[0].active).toBe(false)
    expect(removed.ports.map((item) => item.port)).toEqual([5173])
    const end = await handleKeyDown(state, 'End')
    const home = await handleKeyDown(state, 'Home')
    const upperAdd = await handleKeyDown(state, 'A')
    const lowerAdd = await handleKeyDown(state, 'a')
    const up = await handleKeyDown({ ...state, focusedIndex: 1 }, 'ArrowUp')
    const spacebar = await handleKeyDown(down, 'Spacebar')
    const backspace = await handleKeyDown(down, 'Backspace')
    expect(end.focusedIndex).toBe(1)
    expect(home.focusedIndex).toBe(0)
    expect(upperAdd.editing).toBe(true)
    expect(lowerAdd.editing).toBe(true)
    expect(up.focusedIndex).toBe(0)
    expect(spacebar.ports[0].active).toBe(false)
    expect(backspace.ports.map((item) => item.port)).toEqual([5173])
  })

  test('enter opens the selected address', async () => {
    const commandMap = {
      'Main.openUri': async (): Promise<void> => {},
    }
    using mockRpc = RendererWorker.registerMockRpc(commandMap)
    const state = setPorts(createTestState({ focusedIndex: 0 }), [{ port: 3000 }])
    await handleKeyDown(state, 'Enter')
    expect(mockRpc.invocations).toEqual([['Main.openUri', 'http://localhost:3000', undefined, undefined]])
  })

  test('keyboard ignores unrelated keys, editing, and absent selection', async () => {
    const state = createTestState()
    expect(await handleKeyDown(state, 'Enter')).toBe(state)
    expect(await handleKeyDown(state, 'x')).toBe(state)
    const editing = { ...state, editing: true }
    expect(await handleKeyDown(editing, 'ArrowDown')).toBe(editing)
    expect(handleBlur({ ...state, focusedIndex: 2 }).focusedIndex).toBe(-1)
  })
})
