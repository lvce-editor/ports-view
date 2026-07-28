import { describe, expect, test } from '@jest/globals'
import { normalizePort, normalizePorts } from '../src/parts/NormalizePort/NormalizePort.ts'

describe('normalizePort', () => {
  test('fills defaults', () => {
    expect(normalizePort({ port: 3000 })).toEqual({
      active: true,
      forwardedAddress: 'localhost:3000',
      origin: 'User Forwarded',
      port: 3000,
      runningProcess: '',
    })
  })

  test('preserves supplied values', () => {
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

  test.each([0, 65_536, 1.5, NaN])('rejects invalid port %p', (port) => {
    expect(() => normalizePort({ port })).toThrow('port must be an integer between 1 and 65535')
  })

  test('rejects invalid input', () => {
    expect(() => normalizePort(null as never)).toThrow('port must be an object')
  })

  test('rejects non-string fields', () => {
    expect(() => normalizePort({ forwardedAddress: 1 as never, port: 3000 })).toThrow('forwardedAddress must be a string')
    expect(() => normalizePort({ port: 3000, runningProcess: 1 as never })).toThrow('runningProcess must be a string')
    expect(() => normalizePort({ origin: 1 as never, port: 3000 })).toThrow('origin must be a string')
  })

  test('rejects invalid active value', () => {
    expect(() => normalizePort({ active: 'yes' as never, port: 3000 })).toThrow('active must be a boolean')
  })
})

describe('normalizePorts', () => {
  test('sorts by port number and keeps the last duplicate', () => {
    expect(normalizePorts([{ port: 9000 }, { forwardedAddress: 'localhost:3000', port: 3000 }, { active: false, port: 9000 }])).toEqual([
      expect.objectContaining({ port: 3000 }),
      expect.objectContaining({ active: false, port: 9000 }),
    ])
  })

  test('rejects non-array input', () => {
    expect(() => normalizePorts({} as never)).toThrow('ports must be an array')
  })
})
