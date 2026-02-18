import { RiArrowDropUpLine } from "react-icons/ri";

import { useScrollVisibility } from 'src/hooks/useScrollVisibility';

function ScrollButton() {

  const { visible, scrollToTop } = useScrollVisibility();
  
  return (
        <button 
          onClick={scrollToTop} 
          className={`fixed right-6 bottom-16 md:right-10 flex justify-center items-center w-17 h-17 text-4xl bg-transparent backdrop-brightness-70 backdrop-blur-3xl transition-all duration-300 ease rounded-3xl shadow-lg hover:backdrop-brightness-90 z-20 ${visible ? 'opacity-100 scale-100 cursor-pointer' : 'scale-0 opacity-0 pointer-events-none'}`}>
            <RiArrowDropUpLine />
        </button>
  );
};

export default ScrollButton;