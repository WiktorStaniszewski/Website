import { useState, useEffect } from 'react';

export function useScrollVisibility() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
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

    return { visible, scrollToTop };
}