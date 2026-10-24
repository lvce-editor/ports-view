import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
// eslint-disable-next-line jest/no-restricted-jest-methods
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: { invoke },
}))

const { submitAddPort } = await import('../src/parts/AddPortEditor/AddPortEditor.ts')
const { removePort } = await import('../src/parts/RemovePort/RemovePort.ts')
const { togglePortActive } = await import('../src/parts/TogglePortActive/TogglePortActive.ts')
const { createTestState } = await import('../src/parts/TestState/TestState.ts')

test('adds a Remote SSH port only after the local forwarding listener is created', async () => {
  invoke.mockResolvedValueOnce({ localPort: 43_000, remotePort: 3000 })
  const state = createTestState({
    addPortValue: '3000',
    editing: true,
    workspaceUri: 'remote-ssh://host/work',
  })

  await expect(submitAddPort(state)).resolves.toMatchObject({
    editing: false,
    ports: [
      {
        active: true,
        forwardedAddress: 'localhost:43000',
        origin: 'Remote SSH',
        port: 3000,
      },
    ],
  })
})

test('keeps a failed Remote SSH forward out of the active port list', async () => {
  invoke.mockRejectedValueOnce(new Error('Address already in use'))
  const state = createTestState({
    addPortValue: '3000',
    editing: true,
    workspaceUri: 'remote-ssh://host/work',
  })

  await expect(submitAddPort(state)).resolves.toMatchObject({
    addPortError: 'Address already in use',
    editing: true,
    ports: [],
  })
})

test('reports malformed forwarding responses and preserves an existing row', async () => {
  invoke.mockResolvedValueOnce(null)
  const state = createTestState({
    addPortValue: '3000',
    editing: true,
    ports: [{ active: false, forwardedAddress: '', origin: 'Remote SSH', port: 3000, runningProcess: '' }],
    workspaceUri: 'remote-ssh://host/work',
  })

  await expect(submitAddPort(state)).resolves.toMatchObject({
    addPortError: 'Remote SSH returned an invalid local forwarding port',
    ports: [expect.objectContaining({ active: false, port: 3000 })],
  })

  invoke.mockResolvedValueOnce({ localPort: 65_536 })
  await expect(submitAddPort(state)).resolves.toMatchObject({
    addPortError: 'Remote SSH returned an invalid local forwarding port',
    ports: [expect.objectContaining({ active: false, port: 3000 })],
  })
})

test('shows non-Error failures from Remote SSH forwarding', async () => {
  invoke.mockRejectedValueOnce('SSH process unavailable')
  const state = createTestState({ addPortValue: '3000', editing: true, workspaceUri: 'remote-ssh://host/work' })

  await expect(submitAddPort(state)).resolves.toMatchObject({
    addPortError: 'SSH process unavailable',
    editing: true,
  })
})

test('stops an SSH forward before removing its row', async () => {
  invoke.mockResolvedValueOnce(undefined)
  const state = createTestState({
    ports: [{ active: true, forwardedAddress: 'localhost:3000', origin: 'Remote SSH', port: 3000, runningProcess: '' }],
    workspaceUri: 'remote-ssh://host/work',
  })
  const { uid } = state

  await expect(removePort(state, 3000)).resolves.toMatchObject({ ports: [] })
  expect(invoke).toHaveBeenCalledWith('Application.executeForView', uid, 'PortProvider.stopForwardPort', 3000)
})

test('keeps a port visible when Remote SSH cannot stop it', async () => {
  invoke.mockRejectedValueOnce('SSH control connection failed')
  const state = createTestState({
    ports: [{ active: true, forwardedAddress: 'localhost:3000', origin: 'Remote SSH', port: 3000, runningProcess: '' }],
    workspaceUri: 'remote-ssh://host/work',
  })

  await expect(removePort(state, 3000)).resolves.toMatchObject({
    addPortError: 'SSH control connection failed',
    editing: true,
    ports: [expect.objectContaining({ port: 3000 })],
  })
})

test('stops and restarts a Remote SSH forward when its active state changes', async () => {
  const state = createTestState({
    ports: [{ active: true, forwardedAddress: 'localhost:3000', origin: 'Remote SSH', port: 3000, runningProcess: '' }],
    workspaceUri: 'remote-ssh://host/work',
  })
  const { ports, uid } = state
  invoke.mockResolvedValueOnce(undefined)
  await expect(togglePortActive(state, 3000)).resolves.toMatchObject({
    ports: [expect.objectContaining({ active: false })],
  })
  expect(invoke).toHaveBeenLastCalledWith('Application.executeForView', uid, 'PortProvider.stopForwardPort', 3000)

  invoke.mockResolvedValueOnce({ localPort: 43_000 })
  const [port] = ports
  await expect(togglePortActive({ ...state, ports: [{ ...port, active: false }] }, 3000)).resolves.toMatchObject({
    ports: [expect.objectContaining({ active: true, forwardedAddress: 'localhost:43000' })],
  })
})

test('ignores unknown Remote SSH ports and rejects invalid restart responses', async () => {
  const state = createTestState({ workspaceUri: 'remote-ssh://host/work' })
  await expect(togglePortActive(state, 3000)).resolves.toBe(state)

  const inactive = createTestState({
    ports: [{ active: false, forwardedAddress: '', origin: 'Remote SSH', port: 3000, runningProcess: '' }],
    workspaceUri: 'remote-ssh://host/work',
  })
  invoke.mockResolvedValueOnce({ localPort: 0 })
  await expect(togglePortActive(inactive, 3000)).resolves.toMatchObject({
    addPortError: 'Remote SSH returned an invalid local forwarding port',
    ports: [expect.objectContaining({ active: false })],
  })

  invoke.mockResolvedValueOnce({})
  await expect(togglePortActive(inactive, 3000)).resolves.toMatchObject({
    addPortError: 'Remote SSH returned an invalid local forwarding port',
    ports: [expect.objectContaining({ active: false })],
  })
})
