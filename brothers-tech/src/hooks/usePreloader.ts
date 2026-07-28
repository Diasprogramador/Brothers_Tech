import { useState, useCallback } from "react";

export const usePreloader = () => {
  const [isPreloading, setIsPreloading] = useState(true);

  const handleComplete = useCallback(() => {
    setIsPreloading(false);
  }, []);

  return { isPreloading, onComplete: handleComplete };
};
