import type { Port } from '../Port/Port.ts'
import type { PortInput } from '../PortInput/PortInput.ts'

const assertString: (value: unknown, name: string) => asserts value is string = (value, name) => {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string`)
  }
}

export const normalizePort = (input: PortInput): Port => {
  if (!input || typeof input !== 'object') {
    throw new TypeError('port must be an object')
  }
  const { port } = input
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new RangeError('port must be an integer between 1 and 65535')
  }
  const forwardedAddress = input.forwardedAddress ?? `localhost:${port}`
  const runningProcess = input.runningProcess ?? ''
  const origin = input.origin ?? 'User Forwarded'
  assertString(forwardedAddress, 'forwardedAddress')
  assertString(runningProcess, 'runningProcess')
  assertString(origin, 'origin')
  if (input.active !== undefined && typeof input.active !== 'boolean') {
    throw new TypeError('active must be a boolean')
  }
  return {
    active: input.active ?? true,
    forwardedAddress,
    origin,
    port,
    runningProcess,
  }
}

export const normalizePorts = (ports: readonly PortInput[]): readonly Port[] => {
  if (!Array.isArray(ports)) {
    throw new TypeError('ports must be an array')
  }
  const byPort = new Map<number, Port>()
  for (const port of ports) {
    const normalized = normalizePort(port)
    byPort.set(normalized.port, normalized)
  }
  return byPort
    .values()
    .toArray()
    .toSorted((a, b) => a.port - b.port)
}
