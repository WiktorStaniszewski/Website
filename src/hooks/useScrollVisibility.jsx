import { useState, useEffect } from 'react';

export function useScrollVisibility() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop;
            if (scrolled > 200) {
                setVisible(true);
            } else if (scrolled <= 100) {
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