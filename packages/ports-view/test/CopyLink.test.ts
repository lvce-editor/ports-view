import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { copyLink } from '../src/parts/CopyLink/CopyLink.ts'
import { createTestState } from '../src/parts/TestState/TestState.ts'

test('copyLink writes the navigable address to the clipboard', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const state = createTestState()

  const result = await copyLink(state, 'http://localhost:3000')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'http://localhost:3000']])
})
