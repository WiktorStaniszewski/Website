import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import 'styles/Shop.css';
import { FiX, FiFilter } from 'react-icons/fi';

import Category from './FilterCategory';
import Price from './FilterPrice';
import Flavors from './FilterFlavors';
import Cafe from './FilterCafe';

import { useViewport } from 'hooks/useViewport';

function Sidebar({ filters, isFilterMenuOpen, toggleFilterMenu }) {
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

  const contentClasses = "flex-1 overflow-y-auto custom-scrollbar";

  if (isMobile) {
    return createPortal(
      <aside 
        className={`fixed inset-0 z-999 bg-[#24201d] transition-all duration-300 ease-in-out flex flex-col ${
          isFilterMenuOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 translate-y-full invisible pointer-events-none"
        }`}
        style={{ margin: 0 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#24201d] shrink-0 ">
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

        {/* Zawartość mobilnego menu (filtry) */}
        <div className={`${contentClasses} p-6 space-y-8 pb-32`}>
            <Category handleChange={filters.handleCategoryChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Price handleChange={filters.handlePriceChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Flavors handleChange={filters.handleFlavorsChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Cafe handleChange={filters.handleCafeChange} />
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-white/10 bg-[#24201d] shrink-0 pb-safe-area">
              <button 
                onClick={toggleFilterMenu}
                className="w-full py-4 bg-(--medium-shade) text-[#24201d] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(143,120,93,0.3)] active:scale-95 transition-transform cursor-pointer"
              >
                Pokaż Wyniki
              </button>
        </div>
      </aside>,
      document.body
    );
  }

  return (
    <aside className="flex flex-col w-full gap-6 sticky top-28 pt-19">
        <div className={`${contentClasses} space-y-6 pr-4 pt-6`}>
            <Category handleChange={filters.handleCategoryChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Price handleChange={filters.handlePriceChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Flavors handleChange={filters.handleFlavorsChange} />
            <div className="h-px bg-white/5 w-full"></div>
            
            <Cafe handleChange={filters.handleCafeChange} />
        </div>
    </aside>
  );
}

export default Sidebar;