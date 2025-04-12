import { useEffect, useRef, useState } from "react";

type SmartLoadingOptions = {
  loading: boolean;
  minimumDuration?: number; // por defecto 500ms
};

export function useSmarterLoading({ loading, minimumDuration = 500 }: SmartLoadingOptions) {
  const [showLoading, setShowLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (loading && !hasLoadedOnce.current) {
      setShowLoading(true);
      timeout = setTimeout(() => {
        setShowLoading(false);
        hasLoadedOnce.current = true;
      }, minimumDuration);
    } else if (!loading) {
      setShowLoading(false);
      hasLoadedOnce.current = true;
    }

    return () => clearTimeout(timeout);
  }, [loading, minimumDuration]);

  return { showLoading };
}
