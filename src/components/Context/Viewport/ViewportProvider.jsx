import { useState, useEffect } from 'react';
import { ViewportContext } from './ViewportContext';

export function ViewportProvider({ children }) {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width < 1024;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ViewportContext.Provider value={{ width, isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
}
