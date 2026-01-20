import React, { useEffect } from 'react'; // Added useEffect
import 'styles/Shop.css';
import { BsShop } from "react-icons/bs";
import { FiX, FiFilter } from 'react-icons/fi';

import Category from './FilterCategory';
import Price from './FilterPrice';
import Flavors from './FilterFlavors'
import Cafe from './FilterCafe';

import { useViewport } from 'hooks/useViewport';

function Sidebar({filters, isFilterMenuOpen, toggleFilterMenu}) {
  const { isMobile } = useViewport();

  useEffect(() => {
    if (isMobile && isFilterMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isFilterMenuOpen]);

  const containerClass = isMobile 
    ? `fixed top-0 left-0 w-full z-50 bg-[#24201d] transition-transform duration-300 ease-in-out flex flex-col max-h-screen shadow-2xl ${isFilterMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
    : `flex flex-col w-full gap-6 sticky top-28`; 

  return (
    <aside className={containerClass}>
        
        {isMobile && (
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#24201d]/50 backdrop-blur-md pt-24">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-(--font-color)">
                    <FiFilter className="text-(--medium-shade)" />
                    Filtry
                </h2>
                <button 
                    onClick={toggleFilterMenu} 
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
                >
                    <FiX size={24} />
                </button>
            </div>
        )}

        {!isMobile && (
             <div className="mb-4 text-3xl text-(--medium-shade) pl-2 opacity-80">
                 <BsShop />
             </div>
        )}

        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-6 space-y-8' : 'space-y-6 pr-2 pt-6'}`}>
            <Category handleChange={filters.handleCategoryChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Price handleChange={filters.handlePriceChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Flavors handleChange={filters.handleFlavorsChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Cafe handleChange={filters.handleCafeChange} />
        </div>
        
        {isMobile && (
            <div className="p-6 border-t border-white/10 bg-[#24201d] safe-area-pb">
                 <button 
                    onClick={toggleFilterMenu}
                    className="w-full py-4 bg-(--medium-shade) text-[#24201d] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(143,120,93,0.3)] active:scale-95 transition-transform cursor-pointer"
                 >
                    Pokaż Wyniki
                 </button>
            </div>
        )}
    </aside>
  )
}

export default Sidebar