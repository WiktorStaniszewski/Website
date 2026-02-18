import { useState, useEffect } from "react";
import { useClickAway } from '@uidotdev/usehooks';

{/* 
  
  */}

export default function useHeaderLogic() {
  const [isShown, setIsShown] = useState(false);

  const showOnHover = () => {
    setIsShown(prev => !prev);
  };

  const ref = useClickAway(() => {
    setIsShown(false);
  });

  const toggleScroll = (lockScroll) => {
    document.body.style.overflowY = lockScroll ? 'hidden' : 'auto';
  };

  const [isActive, setIsActive] = useState(true);
  const toggleClass = () => {
    setIsActive(prev => {
      const newState = !prev;
      toggleScroll(!newState);
      return newState;
    });
  };

  useEffect(() => {
    return () => {
      toggleScroll();
    };
  }, []);


  return {
    isShown,
    showOnHover,
    ref,
    isActive,
    toggleClass,
  };
}

