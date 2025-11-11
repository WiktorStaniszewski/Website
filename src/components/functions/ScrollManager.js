import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Load from sessionStorage or fallback to {}
const getInitialPositions = () => {
  try {
    const stored = sessionStorage.getItem("scrollPositions");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

let scrollPositions = getInitialPositions();

export default function ScrollManager({ children }) {
  const location = useLocation();
  const { pathname, key } = location;

  const rafId = useRef(null); // requestAnimationFrame id
  const ticking = useRef(false); // throttle flag

  useEffect(() => {
    const saveOnScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          scrollPositions[pathname] = window.scrollY;

          // Save to sessionStorage
          try {
            sessionStorage.setItem("scrollPositions", JSON.stringify(scrollPositions));
          } catch {
            /* ignore storage errors */
          }

          ticking.current = false;
        });
      }
    };

    if (pathname === "/shop") {
      const targetY = scrollPositions[pathname] ?? 0;

      const tryRestore = (attempt = 0) => {
        const maxScrollable =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScrollable >= targetY || attempt > 120) {
          window.scrollTo(0, targetY);
          return;
        }
        rafId.current = requestAnimationFrame(() => tryRestore(attempt + 1));
      };

      requestAnimationFrame(() => tryRestore());

      window.addEventListener("scroll", saveOnScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", saveOnScroll, { passive: true });
        if (rafId.current) cancelAnimationFrame(rafId.current);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, key]);

  return children;
}