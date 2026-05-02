import React, { useState, useRef, useEffect } from 'react';
import 'styles/Shop.css';
import { RxHamburgerMenu } from "react-icons/rx";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useViewport } from 'hooks/useViewport';
import { useCart } from 'src/context/CartProvider';
import SearchInput from './SearchInput';

function Navigation({filters, toggleFilterMenu}) {
  const { isMobile } = useViewport();
  const { cartCount } = useCart();
  
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
      if (isSearchExpanded && searchInputRef.current) {
          searchInputRef.current.focus();
      }
  }, [isSearchExpanded]);

  return (
      <nav className='bg-[#24201d]/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg sticky top-24 z-20 min-h-[72px]'>
          
          {!isMobile ? (
              <div className="flex-1 max-w-lg">
                <SearchInput 
                    value={filters.query}
                    onChange={filters.handleInputChange}
                />
              </div>
          ) : (
              <div className="flex items-center justify-center w-full relative h-12">
                  
                  <div className={`absolute inset-0 flex items-center transition-all duration-400 ease-out ${
                      isSearchExpanded ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 -z-10 translate-x-4 pointer-events-none'
                  }`}>
                      <SearchInput 
                          inputRef={searchInputRef}
                          value={filters.query}
                          onChange={filters.handleInputChange}
                          onClear={() => setIsSearchExpanded(false)}
                      />
                  </div>

                  <div className={`flex gap-2 transition-all duration-400 ease-out ${
                      isSearchExpanded ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
                  }`}>
                      
                      <button 
                          className='w-12 h-12 rounded-xl bg-white/5 hover:bg-(--medium-shade) transition-colors border border-white/10 cursor-pointer flex items-center justify-center group'
                          onClick={() => setIsSearchExpanded(true)}
                          title="Szukaj"
                      >
                          <FiSearch className='text-xl text-white/80 group-hover:text-[#24201d] transition-colors'/>
                      </button>

                      <Link 
                          to="/cart"
                          className='relative w-12 h-12 rounded-xl bg-white/5 hover:bg-(--medium-shade) transition-colors border border-white/10 cursor-pointer flex items-center justify-center group'
                          title="Koszyk"
                      >
                          <FiShoppingCart className='text-xl text-white/80 group-hover:text-[#24201d] transition-colors'/>
                          {cartCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-(--medium-shade) text-[#24201d] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[#24201d]">
                                  {cartCount}
                              </span>
                          )}
                      </Link>

                      <button 
                          className='w-12 h-12 rounded-xl bg-white/5 hover:bg-(--medium-shade) transition-colors border border-white/10 cursor-pointer flex items-center justify-center group'
                          onClick={toggleFilterMenu}
                          title="Filtry"
                      >
                          <RxHamburgerMenu className='text-xl text-white/80 group-hover:text-[#24201d] transition-colors'/>
                      </button>

                  </div>
              </div>
          )}
      </nav> 
  )
}

export default React.memo(Navigation);