import { useEffect, useRef, useState } from 'react';

interface ScrollState {
  scrollX: number;
  scrollY: number;
  isScrolling: boolean;
}

/**
 * Customized hook to obtain scroll positions (X and Y)
 * and  detect if the user is scrolling.
 * NT: This only works on the general window object. For specific elements, you need to use a different hook.
 * @param {number} timeOut - Time to wait before the scroll event is considered finished.
 * @returns {{ scrollX: number; scrollY: number; isScrolling: boolean }} - Scroll positions and scroll status.
 */
export function useScroll(timeOut: number = 150): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollX: 0,
    scrollY: 0,
    isScrolling: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref  for the timeout
  const throttleRef = useRef(false); // Ref for control throttle

  const handleScroll = () => {
    if (throttleRef.current) {return;} // If the throttle is active, we return

    throttleRef.current = true; // Activating the throttle
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    setScrollState({
      scrollX,
      scrollY,
      isScrolling: true,
    });

    // Reset the throttle, so we can detect the next scroll event
    timeoutRef.current = setTimeout(() => {
      throttleRef.current = false;
      setScrollState((prevState) => ({
        ...prevState,
        isScrolling: false,
      }));
    }, timeOut); // This can be adjusted to be more quick or slow


  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return scrollState;
}
