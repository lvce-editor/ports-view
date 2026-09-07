import { measureMemory } from '@lvce-editor/measure-memory'
import { join } from 'node:path'
import { root } from './root.ts'

const threshold = 535_000

const instantiations = 5_000

const instantiationsPath = join(root, 'packages', 'ports-view')

const workerPath = join(root, '.tmp/dist/dist/portsViewWorkerMain.js')

const playwrightPath = import.meta.resolve('../../../node_modules/playwright/index.mjs')

await measureMemory({
  playwrightPath,
  workerPath,
  threshold,
  instantiations,
  instantiationsPath,
})
