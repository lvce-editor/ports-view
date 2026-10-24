import { expect, test } from '@jest/globals'
import { normalizePort, normalizePorts } from '../src/parts/NormalizePort/NormalizePort.ts'

test('normalizePort: fills defaults', () => {
  expect(normalizePort({ port: 3000 } as never)).toEqual({
    active: true,
    forwardedAddress: 'localhost:3000',
    origin: 'User Forwarded',
    port: 3000,
    runningProcess: '',
  })
})

test('normalizePort: preserves supplied values', () => {
  expect(
    normalizePort({
      active: false,
      forwardedAddress: '127.0.0.1:9000',
      origin: 'Auto Forwarded',
      port: 9000,
      runningProcess: 'node server.js',
    }),
  ).toEqual({
    active: false,
    forwardedAddress: '127.0.0.1:9000',
    origin: 'Auto Forwarded',
    port: 9000,
    runningProcess: 'node server.js',
  })
})

test.each([0, 65_536, 1.5, NaN])('normalizePort: rejects invalid port %p', (port) => {
  expect(() => normalizePort({ port } as never)).toThrow('port must be an integer between 1 and 65535')
})

test('normalizePort: rejects invalid input', () => {
  expect(() => normalizePort(null as never)).toThrow('port must be an object')
})

test('normalizePort: rejects non-string fields', () => {
  expect(() => normalizePort({ forwardedAddress: 1 as never, port: 3000 } as never)).toThrow('forwardedAddress must be a string')
  expect(() => normalizePort({ port: 3000, runningProcess: 1 as never } as never)).toThrow('runningProcess must be a string')
  expect(() => normalizePort({ origin: 1 as never, port: 3000 } as never)).toThrow('origin must be a string')
})

test('normalizePort: rejects invalid active value', () => {
  expect(() => normalizePort({ active: 'yes' as never, port: 3000 } as never)).toThrow('active must be a boolean')
})

test('normalizePorts: sorts by port number and keeps the last duplicate', () => {
  expect(
    normalizePorts([
      { active: true, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
      { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
      { active: false, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
    ]),
  ).toEqual([expect.objectContaining({ port: 3000 }), expect.objectContaining({ active: false, port: 9000 })])
})

test('normalizePorts: rejects non-array input', () => {
  expect(() => normalizePorts({} as never)).toThrow('ports must be an array')
})
