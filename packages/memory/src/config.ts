import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 535_000

export const instantiations = 5_000

export const instantiationsPath = join(root, 'packages', 'ports-view')

export const workerPath = join(root, '.tmp/dist/dist/portsViewWorkerMain.js')

export const playwrightPath = new URL('../../../node_modules/playwright/index.mjs', import.meta.url).toString()
