import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { addPort } from '../src/parts/AddPort/AddPort.ts'
import { cancelAddPort, handleAddPortInput, startAddPort, submitAddPort } from '../src/parts/AddPortEditor/AddPortEditor.ts'
import { focusFirst } from '../src/parts/FocusFirst/FocusFirst.ts'
import { focusNext, focusPrevious } from '../src/parts/FocusIndex/FocusIndex.ts'
import { focusLast } from '../src/parts/FocusLast/FocusLast.ts'
import { getAddressUrl } from '../src/parts/GetAddressUrl/GetAddressUrl.ts'
import { handleBlur } from '../src/parts/HandleBlur/HandleBlur.ts'
import { handleClick } from '../src/parts/HandleClick/HandleClick.ts'
import { handleClickAt } from '../src/parts/HandleClickAt/HandleClickAt.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { openAddress } from '../src/parts/OpenAddress/OpenAddress.ts'
import { openFocusedAddress } from '../src/parts/OpenFocusedAddress/OpenFocusedAddress.ts'
import { removeFocusedPort } from '../src/parts/RemoveFocusedPort/RemoveFocusedPort.ts'
import { removePort } from '../src/parts/RemovePort/RemovePort.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'
import { setPorts } from '../src/parts/SetPorts/SetPorts.ts'
import { createTestState } from '../src/parts/TestState/TestState.ts'
import { toggleFocusedPort } from '../src/parts/ToggleFocusedPort/ToggleFocusedPort.ts'
import { togglePortActive } from '../src/parts/TogglePortActive/TogglePortActive.ts'

test('port mutations: loads, adds, replaces, removes, and toggles ports', async () => {
  const loaded = await loadContent(createTestState({ loaded: false }))
  const added = addPort(loaded, {
    active: true,
    forwardedAddress: 'localhost:9000',
    origin: 'User Forwarded',
    port: 9000,
    runningProcess: '',
  })
  const replaced = addPort(added, {
    active: false,
    forwardedAddress: 'localhost:9000',
    origin: 'User Forwarded',
    port: 9000,
    runningProcess: '',
  })
  const toggled = togglePortActive(replaced, 9000)
  const removed = removePort(toggled, 9000)
  expect(loaded.loaded).toBe(true)
  expect(added.ports).toHaveLength(1)
  expect(replaced.ports).toEqual([expect.objectContaining({ active: false, port: 9000 })])
  expect(toggled.ports).toEqual([expect.objectContaining({ active: true, port: 9000 })])
  expect(toggled.visiblePorts).toEqual([expect.objectContaining({ active: true, index: 0, port: 9000, selected: false })])
  expect(removed.ports).toEqual([])
})

test('port mutations: ignores unknown toggle and remove targets', () => {
  const state = setPorts(createTestState(), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
  ])
  const { ports } = state
  expect(togglePortActive(state, 9000).ports).toEqual(ports)
  expect(removePort(state, 9000).ports).toEqual(ports)
})

test('add port editor: opens, updates, submits, and closes', () => {
  const opened = startAddPort(createTestState())
  const updated = handleAddPortInput(opened, ' 5173 ')
  const submitted = submitAddPort(updated)
  expect(opened.editing).toBe(true)
  expect(updated.addPortValue).toBe(' 5173 ')
  expect(submitted).toMatchObject({ addPortError: '', addPortValue: '', editing: false })
  expect(submitted.ports).toEqual([
    {
      active: true,
      forwardedAddress: 'localhost:5173',
      origin: 'User Forwarded',
      port: 5173,
      runningProcess: '',
    },
  ])
})

test.each(['', 'abc', '0', '65536'])('add port editor: shows validation for %p', (value) => {
  const state = submitAddPort(createTestState({ addPortValue: value, editing: true }))
  const { addPortError, editing } = state
  expect(addPortError).toBe('Enter a port number between 1 and 65535')
  expect(editing).toBe(true)
})

test('add port editor: cancels without adding a port', () => {
  const state = createTestState({ addPortValue: '3000', editing: true })
  expect(cancelAddPort(state)).toMatchObject({ addPortError: '', addPortValue: '', editing: false })
  expect(cancelAddPort(state).ports).toHaveLength(0)
})

test('interaction: selects a row from pointer coordinates and ignores outside clicks', () => {
  const state = setPorts(createTestState({ y: 10 }), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  expect(handleClickAt(state, 10 + 28 + 25).focusedIndex).toBe(1)
  expect(handleClickAt(state, 10 + 28).focusedIndex).toBe(0)
  const { listHeight } = state
  expect(handleClickAt(state, 10 + 28 + listHeight)).toBe(state)
  expect(handleClickAt(state, 0)).toBe(state)
})

test('interaction: clicking status selects and toggles a port', async () => {
  const state = setPorts(createTestState(), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  const result = await handleClick(state, 28 + 24 + 1, 'port-status-3000')
  expect(result.focusedIndex).toBe(1)
  expect(result.ports[0].active).toBe(true)
  expect(result.ports[1].active).toBe(false)
  expect(await handleClick(state, 28 + 1, '')).toMatchObject({ focusedIndex: 0 })
  expect(await handleClick(state, 0, 'port-status-9999')).toBe(state)
})

test('interaction: opens the address from the clicked row', async () => {
  const commandMap = {
    'Layout.showPreview': async (): Promise<void> => {},
    'SimpleBrowser.openOrRevealTab': async (): Promise<void> => {},
  }
  using mockRpc = RendererWorker.registerMockRpc(commandMap)
  const state = setPorts(createTestState(), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  const result = await handleClick(state, 28 + 24 + 1, 'port-address-3000')
  expect(result.focusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual([
    ['Layout.showPreview', 'simple-browser://'],
    ['SimpleBrowser.openOrRevealTab', 'http://localhost:5173'],
  ])
})

test('interaction: uses scrolled coordinates for row actions', async () => {
  const state = setDeltaY(
    setPorts(createTestState(), [
      { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
      { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
      { active: true, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
    ]),
    13,
  )
  expect(handleClickAt(state, 28 + 24).focusedIndex).toBe(1)
  const result = await handleClick(state, 28 + 24, 'port-status-3000')
  expect(result.focusedIndex).toBe(1)
  expect(result.ports[0].active).toBe(true)
  expect(result.ports[1].active).toBe(false)
})

test('interaction: address utilities preserve and add schemes', () => {
  expect(getAddressUrl('localhost:3000')).toBe('http://localhost:3000')
  expect(getAddressUrl('https://example.com')).toBe('https://example.com')
})

test('interaction: opens forwarded addresses', async () => {
  const commandMap = {
    'Layout.showPreview': async (): Promise<void> => {},
    'SimpleBrowser.openOrRevealTab': async (): Promise<void> => {},
  }
  using mockRpc = RendererWorker.registerMockRpc(commandMap)
  const state = setPorts(createTestState(), [
    { active: true, forwardedAddress: '127.0.0.1:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
  ])
  await openAddress(state, 3000)
  await handleClick(state, 28 + 1, 'port-address-3000')
  expect(mockRpc.invocations).toEqual([
    ['Layout.showPreview', 'simple-browser://'],
    ['SimpleBrowser.openOrRevealTab', 'http://127.0.0.1:3000'],
    ['Layout.showPreview', 'simple-browser://'],
    ['SimpleBrowser.openOrRevealTab', 'http://127.0.0.1:3000'],
  ])
})

test('interaction: does not open unknown or empty addresses', async () => {
  const commandMap = {
    'Layout.showPreview': async (): Promise<void> => {},
    'SimpleBrowser.openOrRevealTab': async (): Promise<void> => {},
  }
  using mockRpc = RendererWorker.registerMockRpc(commandMap)
  await openAddress(createTestState(), 3000)
  await openAddress(
    setPorts(createTestState(), [{ active: true, forwardedAddress: '', origin: 'User Forwarded', port: 3000, runningProcess: '' }]),
    3000,
  )
  expect(mockRpc.invocations).toEqual([])
})

test('interaction: navigation, activation, deletion, and add commands', () => {
  const state = setPorts(createTestState(), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
  ])
  const down = focusNext(state)
  const toggled = toggleFocusedPort(down)
  const removed = removeFocusedPort(toggled)
  expect(down.focusedIndex).toBe(0)
  expect(toggled.ports[0].active).toBe(false)
  expect(removed.ports.map((item) => item.port)).toEqual([5173])
  const end = focusLast(state)
  const home = focusFirst(state)
  const added = startAddPort(state)
  const up = focusPrevious({ ...state, focusedIndex: 1 })
  expect(end.focusedIndex).toBe(1)
  expect(home.focusedIndex).toBe(0)
  expect(added.editing).toBe(true)
  expect(up.focusedIndex).toBe(0)
})

test('interaction: enter opens the selected address', async () => {
  const commandMap = {
    'Layout.showPreview': async (): Promise<void> => {},
    'SimpleBrowser.openOrRevealTab': async (): Promise<void> => {},
  }
  using mockRpc = RendererWorker.registerMockRpc(commandMap)
  const state = setPorts(createTestState({ focusedIndex: 0 }), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
  ])
  await openFocusedAddress(state)
  expect(mockRpc.invocations).toEqual([
    ['Layout.showPreview', 'simple-browser://'],
    ['SimpleBrowser.openOrRevealTab', 'http://localhost:3000'],
  ])
})

test('interaction: selected commands ignore editing and absent selection', async () => {
  const empty = createTestState()
  const editing = {
    ...setPorts(createTestState({ focusedIndex: 0 }), [
      { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    ]),
    editing: true,
  }
  for (const state of [empty, editing]) {
    expect(await openFocusedAddress(state)).toBe(state)
    expect(toggleFocusedPort(state)).toBe(state)
    expect(removeFocusedPort(state)).toBe(state)
  }
})

test('interaction: blur clears table focus and selection', () => {
  const state = setPorts(createTestState({ focused: true, focusedIndex: 2 }), [
    { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:5173', origin: 'User Forwarded', port: 5173, runningProcess: '' },
    { active: true, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
  ])
  const blurred = handleBlur(state)
  expect(blurred).toMatchObject({ focused: false, focusedIndex: -1 })
  expect(blurred.visiblePorts.every(({ selected }) => !selected)).toBe(true)
})
