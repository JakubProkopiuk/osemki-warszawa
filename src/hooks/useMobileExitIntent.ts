import { useEffect, useRef } from 'react';

export function useMobileExitIntent(onExit: () => void) {
  const lastScrollY = useRef(0);
  const triggered = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (triggered.current) {
        return;
      }

      const current = window.scrollY;
      const doc = document.documentElement;
      const maxScrollable = doc.scrollHeight - window.innerHeight;
      const ratio = maxScrollable > 0 ? current / maxScrollable : 0;
      const movedUpBy = lastScrollY.current - current;

      if (ratio > 0.6 && movedUpBy >= 150) {
        triggered.current = true;
        onExit();
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onExit]);
}

