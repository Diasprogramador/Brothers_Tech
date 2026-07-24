import { useState, useCallback } from 'react';

export function usePreloader() {
  const [isPreloading, setIsPreloading] = useState(true);

  const handleComplete = useCallback(() => {
    setIsPreloading(false);
  }, []);

  return { isPreloading, onComplete: handleComplete };
}
