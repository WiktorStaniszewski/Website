import { useState, useCallback } from "react";

export function useMenus(initialState = {}) {
  const [menu, setMenus] = useState(initialState);

  const toggleMenu = useCallback((menuName) => {
    setMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  }, []);

  return { menu, toggleMenu };
}