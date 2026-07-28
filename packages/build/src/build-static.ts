import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const main = async (): Promise<void> => {
  const sharedProcessPath = join(root, 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

  const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

  const sharedProcess = await import(sharedProcessUrl)

  process.env.PATH_PREFIX = '/ports-view'
  const { commitHash } = await sharedProcess.exportStatic({
    root,
    extensionPath: '',
    testPath: 'packages/e2e',
  })

  const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

  const getRemoteUrl = (path: string): string => {
    const url = pathToFileURL(path).toString().slice(8)
    return `/remote/${url}`
  }

  const content = await readFile(rendererWorkerPath, 'utf8')
  const workerPath = join(root, '.tmp/dist/dist/portsViewWorkerMain.js')
  const remoteUrl = getRemoteUrl(workerPath)

  const occurrence = `// const portsViewWorkerUrl = \`\${assetDir}/packages/ports-view/dist/portsViewWorkerMain.js\`
const portsViewWorkerUrl = \`${remoteUrl}\``
  const replacement = `const portsViewWorkerUrl = \`\${assetDir}/packages/ports-view/dist/portsViewWorkerMain.js\``
  if (!content.includes(occurrence) && !content.includes(replacement)) {
    throw new Error('occurrence not found')
  }
  const newContent = content.includes(occurrence) ? content.replace(occurrence, replacement) : content
  await writeFile(rendererWorkerPath, newContent)

  await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
}

main()
