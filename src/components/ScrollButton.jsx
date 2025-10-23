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
          className={`fixed bottom-10 right-4 md:bottom-20 md:right-14 flex justify-center items-center w-14 h-14 text-3xl bg-transparent backdrop-brightness-80 transition-opacity duration-500 ease rounded-2xl shadow-lg hover:backdrop-brightness-110 ${visible ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}>
            <RiArrowDropUpLine />
        </button>
  );
};

export default ScrollButton