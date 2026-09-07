import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { createTestState } from './TestState.ts'

test('loads port 3000 and its Codespaces forwarded URL from the workspace provider', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Application.executeForView': async () => [
      { forwardedAddress: 'https://test-space-3000.app.github.dev/', origin: 'devcontainer.json', port: 3000 },
    ],
  })
  const result = await loadContent(createTestState(), 'codespaces://test-space/workspaces/app')
  expect(result.ports).toEqual([expect.objectContaining({ forwardedAddress: 'https://test-space-3000.app.github.dev/', port: 3000 })])
  expect(rpc.invocations).toEqual([['Application.executeForView', 1, 'PortProvider.getPorts', 'codespaces://test-space/workspaces/app']])
})

test('clears remote ports when changing to a workspace without providers', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'Application.executeForView': async () => [] })
  const state = createTestState({
    ports: [{ active: true, forwardedAddress: 'https://test-space-3000.app.github.dev/', origin: '', port: 3000, runningProcess: '' }],
  })
  const local = await loadContent(state, 'file:///app')
  const closed = await loadContent(state, '')
  expect(local.ports).toEqual([])
  expect(closed.ports).toEqual([])
  expect(rpc.invocations).toHaveLength(1)
})

test('reports provider failures', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Application.executeForView': async () => {
      throw new Error('disconnected')
    },
  })
  await expect(loadContent(createTestState(), 'codespaces://test-space/app')).rejects.toThrow('disconnected')
  expect(rpc.invocations).toHaveLength(1)
})
