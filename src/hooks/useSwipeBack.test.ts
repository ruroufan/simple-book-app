import { describe, expect, it } from 'vitest';
import { shouldTriggerSwipeBack } from './useSwipeBack';

describe('shouldTriggerSwipeBack', () => {
  it('triggers when the gesture starts at the left edge and swipes right far enough', () => {
    expect(
      shouldTriggerSwipeBack({
        startX: 20,
        startY: 100,
        endX: 110,
        endY: 115,
        edgeWidth: 40,
        threshold: 70,
      }),
    ).toBe(true);
  });

  it('does not trigger outside the left edge', () => {
    expect(
      shouldTriggerSwipeBack({
        startX: 60,
        startY: 100,
        endX: 160,
        endY: 105,
        edgeWidth: 40,
        threshold: 70,
      }),
    ).toBe(false);
  });

  it('does not trigger for short or mostly vertical gestures', () => {
    expect(
      shouldTriggerSwipeBack({
        startX: 20,
        startY: 100,
        endX: 80,
        endY: 110,
        edgeWidth: 40,
        threshold: 70,
      }),
    ).toBe(false);

    expect(
      shouldTriggerSwipeBack({
        startX: 20,
        startY: 100,
        endX: 115,
        endY: 210,
        edgeWidth: 40,
        threshold: 70,
      }),
    ).toBe(false);
  });
});
