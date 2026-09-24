import { describe, expect, test } from '@jest/globals'
import { focusIndex, focusNext, focusPrevious } from '../src/parts/FocusIndex/FocusIndex.ts'
import { handleWheel } from '../src/parts/HandleWheel/HandleWheel.ts'
import { recalculateVirtualList } from '../src/parts/RecalculateVirtualList/RecalculateVirtualList.ts'
import { resize } from '../src/parts/Resize/Resize.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'
import { setPorts } from '../src/parts/SetPorts/SetPorts.ts'
import { createTestState } from '../src/parts/TestState/TestState.ts'

const manyPorts = Array.from({ length: 1000 }, (_, index) => ({
  active: true,
  forwardedAddress: `localhost:${index + 1}`,
  origin: 'User Forwarded',
  port: index + 1,
  runningProcess: '',
}))

describe('virtual list', () => {
  test('only exposes enough rows for the viewport', () => {
    const state = setPorts(createTestState(), manyPorts)
    const { finalDeltaY, maxLineY, minLineY, scrollBarHeight } = state
    expect(minLineY).toBe(0)
    expect(maxLineY).toBe(5)
    expect(finalDeltaY).toBe(23_904)
    expect(scrollBarHeight).toBe(20)
    const { visiblePorts } = state
    expect(visiblePorts.map(({ index }) => index)).toEqual([0, 1, 2, 3, 4])
  })

  test('calculates a middle range', () => {
    const state = setDeltaY(setPorts(createTestState(), manyPorts), 12_000)
    const { maxLineY, minLineY, scrollBarY } = state
    expect(minLineY).toBe(500)
    expect(maxLineY).toBe(505)
    expect(scrollBarY).toBeGreaterThan(0)
    const { visiblePorts } = state
    expect(visiblePorts.map(({ index, port }) => [port, index])).toEqual([
      [501, 500],
      [502, 501],
      [503, 502],
      [504, 503],
      [505, 504],
    ])
  })

  test('clamps overscroll', () => {
    const state = setDeltaY(setPorts(createTestState(), manyPorts), 1_000_000)
    const { deltaY, finalDeltaY, maxLineY } = state
    expect(deltaY).toBe(finalDeltaY)
    expect(maxLineY).toBe(1000)
  })

  test('handles empty and zero-height lists', () => {
    const state = recalculateVirtualList(createTestState({ height: 64, itemHeight: 0 }))
    expect(state).toMatchObject({ deltaY: 0, listHeight: 0, maxLineY: 0, minLineY: 0, scrollBarHeight: 0 })
    const { visiblePorts } = state
    expect(visiblePorts).toEqual([])
  })

  test('refreshes visible row data and selection after port and focus changes', () => {
    const loaded = setPorts(createTestState(), manyPorts)
    const focused = focusIndex(loaded, 2)
    expect(focused.visiblePorts[2]).toMatchObject({ index: 2, port: 3, selected: true })
    const replaced = setPorts(focused, [{ ...manyPorts[2], active: false }])
    expect(replaced.visiblePorts).toEqual([{ ...manyPorts[2], active: false, index: 0, selected: true }])
  })

  test('wheel supports pixel and line modes', () => {
    const state = setPorts(createTestState(), manyPorts)
    expect(createTestState().pageScrollMultiplier).toBe(16)
    expect(handleWheel(state, 0, 24).deltaY).toBe(24)
    expect(handleWheel(state, 1, 2).deltaY).toBe(32)
  })

  test('wheel uses the state multiplier for line and page modes but not pixel mode', () => {
    const state = setPorts(createTestState({ pageScrollMultiplier: 5 }), manyPorts)
    expect(handleWheel(state, 0, 2).deltaY).toBe(2)
    expect(handleWheel(state, 1, 2).deltaY).toBe(10)
    expect(handleWheel(state, 2, 2).deltaY).toBe(10)
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
    const { deltaY, minLineY } = state
    expect(deltaY).toBe(168)
    expect(minLineY).toBe(7)
    expect(focusIndex(state, 1).deltaY).toBe(24)
  })

  test('moves backward from no selection to the last row', () => {
    const state = focusPrevious(
      setPorts(createTestState(), [
        { active: true, forwardedAddress: 'localhost:3000', origin: 'User Forwarded', port: 3000, runningProcess: '' },
        { active: true, forwardedAddress: 'localhost:9000', origin: 'User Forwarded', port: 9000, runningProcess: '' },
      ]),
    )
    const { focusedIndex } = state
    expect(focusedIndex).toBe(1)
  })

  test('keeps empty state unfocused', () => {
    expect(focusIndex(createTestState(), 1).focusedIndex).toBe(-1)
  })
})
