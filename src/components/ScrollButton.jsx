import 'styles/ScrollButton.css'
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
          className={`scrollToTopButton ${visible ? 'show' : ''}`}>
            <RiArrowDropUpLine />
        </button>
  );
};

export default ScrollButton