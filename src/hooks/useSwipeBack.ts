import { useEffect, useRef } from 'react';

type SwipeBackOptions = {
  enabled: boolean;
  edgeWidth?: number;
  threshold?: number;
  onBack: () => void;
};

type SwipePoint = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  edgeWidth: number;
  threshold: number;
};

type TouchStartState = {
  x: number;
  y: number;
  latestX: number;
  latestY: number;
  ignored: boolean;
};

export function useSwipeBack({ enabled, edgeWidth = 40, threshold = 70, onBack }: SwipeBackOptions) {
  const startRef = useRef<TouchStartState | null>(null);
  const onBackRef = useRef(onBack);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        startRef.current = null;
        return;
      }

      const touch = event.touches[0];
      startRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        latestX: touch.clientX,
        latestY: touch.clientY,
        ignored: isIgnoredSwipeTarget(event.target),
      };
    }

    function handleTouchMove(event: TouchEvent) {
      if (!startRef.current || event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      startRef.current.latestX = touch.clientX;
      startRef.current.latestY = touch.clientY;
    }

    function handleTouchEnd(event: TouchEvent) {
      const start = startRef.current;
      startRef.current = null;

      if (!start || start.ignored) {
        return;
      }

      if (
        shouldTriggerSwipeBack({
          startX: start.x,
          startY: start.y,
          endX: start.latestX,
          endY: start.latestY,
          edgeWidth,
          threshold,
        })
      ) {
        onBackRef.current();
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [edgeWidth, enabled, threshold]);
}

export function shouldTriggerSwipeBack({ startX, startY, endX, endY, edgeWidth, threshold }: SwipePoint) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  return startX <= edgeWidth && deltaX >= threshold && deltaX > Math.abs(deltaY) * 1.5;
}

function isIgnoredSwipeTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest('input, textarea, select, button, a, [data-swipe-back-ignore="true"]')) {
    return true;
  }

  return Boolean(target.closest('[data-horizontal-scroll="true"]'));
}
