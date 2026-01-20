import 'styles/Shop.css'
import { FiHeart } from 'react-icons/fi'
import { AiOutlineShoppingCart } from 'react-icons/ai' // Optional if unused
import { RxHamburgerMenu } from "react-icons/rx";
import { useViewport } from 'hooks/useViewport'

// Import the new component
import SearchInput from './SearchInput';

export default function Navigation({filters, toggleFilterMenu}) {
  const { isMobile } = useViewport();
  
  return (
      <nav className='bg-[#24201d]/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg sticky top-24 z-20'>
          
          {/* Replaced raw input with SearchInput Component */}
          <div className="flex-1 max-w-lg">
            <SearchInput 
                value={filters.query}
                onChange={filters.handleInputChange}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button className='p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-(--medium-shade) transition-colors'>
                <FiHeart className='text-xl'/>
            </button>
            
            {isMobile && (
                <button 
                    className='p-3 rounded-xl bg-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] transition-colors border border-white/10'
                    onClick={toggleFilterMenu}
                >
                    <RxHamburgerMenu className='text-xl'/>
                </button>
            )}
          </div>
      </nav> 
  )
}