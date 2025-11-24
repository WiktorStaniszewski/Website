import { useState, useEffect } from "react";
import { useClickAway } from '@uidotdev/usehooks';

export default function useHeaderLogic() {
  const [isShown, setIsShown] = useState(false);

  const showOnHover = () => {
    setIsShown(prev => !prev);
  };

  const ref = useClickAway(() => {
    setIsShown(false);
  });

  // hamburgerIcon/sidebar settings - overflow action and buttons functions
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
      toggleScroll(); // reset on unmount
    };
  }, []);

  // displaying the logo on the navbar when scrolling
  const [showLogo, setShowLogo] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowLogo(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isShown,
    showOnHover,
    ref,
    isActive,
    toggleClass,
    showLogo,
  };
}

