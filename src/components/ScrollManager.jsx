import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = { "/shop": 0 };

export default function ScrollManager({ children }) {
  const location = useLocation();
  const { pathname, key } = location;

  useEffect(() => {
    let rafId;

    const saveOnScroll = () => {
      if (pathname === "/shop") {
        scrollPositions["/shop"] = window.scrollY;
      }
    };

    if (pathname === "/shop") {
      const targetY = scrollPositions["/shop"] ?? 0;

      const tryRestore = (attempt = 0) => {
        const maxScrollable =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScrollable >= targetY || attempt > 120) {
          window.scrollTo(0, targetY);
          return;
        }
        rafId = requestAnimationFrame(() => tryRestore(attempt + 1));
      };

      requestAnimationFrame(() => tryRestore());

      window.addEventListener("scroll", saveOnScroll);
      return () => {
        window.removeEventListener("scroll", saveOnScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, key]);

  return children;
}
