import { useEffect, useRef, useState } from 'react';

/**
 * Хук для проверки переполнения контейнера
 */
export const useOverflowCheck = <T extends HTMLElement = HTMLDivElement>({
  direction = 'vertical',
  deps = [],
  listenResize = true,
}: {
  direction?: 'vertical' | 'horizontal' | 'both';
  deps?: unknown[];
  listenResize?: boolean;
} = {}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<T>(null);

  const checkOverflow = () => {
    if (!containerRef.current) return false;

    const container = containerRef.current;
    let overflowDetected = false;

    if (direction === 'vertical' || direction === 'both') {
      overflowDetected =
        overflowDetected || container.scrollHeight > container.clientHeight;
    }

    if (direction === 'horizontal' || direction === 'both') {
      overflowDetected =
        overflowDetected || container.scrollWidth > container.clientWidth;
    }

    setIsOverflowing(overflowDetected);
    return overflowDetected;
  };

  useEffect(() => {
    checkOverflow();

    if (listenResize) {
      const handleResize = () => {
        checkOverflow();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    return undefined;
  }, [direction, listenResize, ...deps]);

  return { isOverflowing, containerRef, checkOverflow };
};

export default useOverflowCheck;
