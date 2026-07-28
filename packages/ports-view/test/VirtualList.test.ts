import { describe, expect, test } from '@jest/globals'
import { focusIndex, focusNext, focusPrevious } from '../src/parts/FocusIndex/FocusIndex.ts'
import { handleWheel } from '../src/parts/HandleWheel/HandleWheel.ts'
import { recalculateVirtualList } from '../src/parts/RecalculateVirtualList/RecalculateVirtualList.ts'
import { resize } from '../src/parts/Resize/Resize.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'
import { setPorts } from '../src/parts/SetPorts/SetPorts.ts'
import { createTestState } from './TestState.ts'

const manyPorts = Array.from({ length: 1000 }, (_, index) => ({ port: index + 1 }))

describe('virtual list', () => {
  test('only exposes enough rows for the viewport', () => {
    const state = setPorts(createTestState(), manyPorts)
    expect(state.minLineY).toBe(0)
    expect(state.maxLineY).toBe(5)
    expect(state.finalDeltaY).toBe(23_904)
    expect(state.scrollBarHeight).toBe(20)
  })

  test('calculates a middle range', () => {
    const state = setDeltaY(setPorts(createTestState(), manyPorts), 12_000)
    expect(state.minLineY).toBe(500)
    expect(state.maxLineY).toBe(505)
    expect(state.scrollBarY).toBeGreaterThan(0)
  })

  test('clamps overscroll', () => {
    const state = setDeltaY(setPorts(createTestState(), manyPorts), 1_000_000)
    expect(state.deltaY).toBe(state.finalDeltaY)
    expect(state.maxLineY).toBe(1000)
  })

  test('handles empty and zero-height lists', () => {
    const state = recalculateVirtualList(createTestState({ height: 64, itemHeight: 0 }))
    expect(state).toMatchObject({ deltaY: 0, listHeight: 0, maxLineY: 0, minLineY: 0, scrollBarHeight: 0 })
  })

  test('wheel supports pixel and line modes', () => {
    const state = setPorts(createTestState(), manyPorts)
    expect(handleWheel(state, 0, 24).deltaY).toBe(24)
    expect(handleWheel(state, 1, 2).deltaY).toBe(32)
  })

  test('resize recalculates visible rows', () => {
    const state = resize(setPorts(createTestState(), manyPorts), { height: 232, width: 900, x: 4, y: 5 })
    expect(state).toMatchObject({ height: 232, maxLineY: 8, width: 900, x: 4, y: 5 })
  })
})

describe('focus', () => {
  test('moves and clamps focus', () => {
    const state = setPorts(createTestState(), manyPorts)
    expect(focusNext(state).focusedIndex).toBe(0)
    expect(focusIndex(state, 500).focusedIndex).toBe(500)
    expect(focusIndex(state, 2000).focusedIndex).toBe(999)
  })

  test('scrolls focused rows into view', () => {
    const state = focusIndex(setPorts(createTestState(), manyPorts), 10)
    expect(state.deltaY).toBe(168)
    expect(state.minLineY).toBe(7)
    expect(focusIndex(state, 1).deltaY).toBe(24)
  })

  test('moves backward from no selection to the last row', () => {
    const state = focusPrevious(setPorts(createTestState(), [{ port: 3000 }, { port: 9000 }]))
    expect(state.focusedIndex).toBe(1)
  })

  test('keeps empty state unfocused', () => {
    expect(focusIndex(createTestState(), 1).focusedIndex).toBe(-1)
  })
})
