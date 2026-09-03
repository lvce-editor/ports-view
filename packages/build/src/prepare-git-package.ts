import { cp, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const source = join(root, '.tmp', 'dist', 'dist')
const destination = join(root, 'dist')

const main = async (): Promise<void> => {
  await rm(destination, { force: true, recursive: true })
  await mkdir(destination, { recursive: true })
  await cp(source, destination, { recursive: true })
}

main()
