import { RiArrowDropUpLine } from "react-icons/ri";
import { useScrollVisibility } from 'src/hooks/useScrollVisibility';

function ScrollButton() {
  const { visible, scrollToTop } = useScrollVisibility();
  
  return (
        <button 
          onClick={scrollToTop} 
          className={`fixed right-5 bottom-15.5 md:right-10 flex justify-center items-center w-17 h-17 text-5xl bg-[#24201d]/60 backdrop-blur-xl border border-white/10 text-white/80 hover:bg-(--medium-shade) hover:text-[#24201d] hover:border-(--medium-shade) transition-all duration-300 ease-out rounded-2xl shadow-lg z-20 ${
              visible ? 'opacity-100 scale-100 cursor-pointer' : 'scale-75 opacity-0 pointer-events-none'
          }`}
          title="Wróć na górę"
        >
            <RiArrowDropUpLine size={35}/>
        </button>
  );
}

export default ScrollButton;