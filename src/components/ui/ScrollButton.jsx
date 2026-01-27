import { RiArrowDropUpLine } from "react-icons/ri";
import { useState, useEffect } from 'react';

function ScrollButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() =>{
	const toggleVisible = () => {
		const scrolled = document.documentElement.scrollTop;
		if (scrolled > 450) {
			setVisible(true);
		} else if (scrolled <= 350) {
			setVisible(false);
		}
    };
    window.addEventListener("scroll", toggleVisible);
    toggleVisible();

    
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

  


  return (
        <button 
          onClick={scrollToTop} 
          className={`fixed right-6 bottom-16 md:right-10 flex justify-center items-center w-17 h-17 text-4xl bg-transparent backdrop-brightness-70 backdrop-blur-3xl transition-all duration-300 ease rounded-3xl shadow-lg hover:backdrop-brightness-90 z-20 ${visible ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}>
            <RiArrowDropUpLine />
        </button>
  );
};

export default ScrollButton