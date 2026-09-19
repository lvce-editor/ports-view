import { expect, test } from '@jest/globals'
import { create } from '../src/parts/Create/Create.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'
import * as PortsStates from '../src/parts/PortsStates/PortsStates.ts'
import { setComponentState } from '../src/parts/SetComponentState/SetComponentState.ts'

test('returns the current state for a ports instance', () => {
  create(1, '', 0, 0, 800, 160, 1, '')
  try {
    expect(getComponentState(1)).toBe(PortsStates.get(1).newState)
  } finally {
    PortsStates.dispose(1)
  }
})

test('updates the requested ports instance', async () => {
  create(1, '', 0, 0, 800, 160, 1, '')
  try {
    const currentState = getComponentState(1)
    await setComponentState(1, { ...currentState, loaded: true })
    expect(getComponentState(1)).toMatchObject({ loaded: true, uid: 1 })
  } finally {
    PortsStates.dispose(1)
  }
})

test('rejects a non-object state', async () => {
  const invalidStates: readonly unknown[] = [null, [], 'invalid']
  for (const state of invalidStates) {
    create(1, '', 0, 0, 800, 160, 1, '')
    try {
      await expect(setComponentState(1, state)).rejects.toThrow('Ports state must be an object')
    } finally {
      PortsStates.dispose(1)
    }
  }
})

test('rejects a state with a different uid without changing the instance', async () => {
  create(1, '', 0, 0, 800, 160, 1, '')
  try {
    const currentState = getComponentState(1)
    await expect(setComponentState(1, { ...currentState, uid: 2 })).rejects.toThrow('Ports state uid must remain 1')
    expect(getComponentState(1)).toBe(currentState)
  } finally {
    PortsStates.dispose(1)
  }
})
