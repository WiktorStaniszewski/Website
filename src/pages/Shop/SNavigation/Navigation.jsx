import 'styles/Shop.css'

import { FiHeart} from 'react-icons/fi'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { RxHamburgerMenu } from "react-icons/rx";

import { useViewport } from 'src/components/hooks/useViewport'

export default function Navigation({filters, toggleFilterMenu}) {
  const { isMobile } = useViewport();
  
  return (
      <nav className='flex bottom-2 lg:top-16 backdrop-blur-lg backdrop-brightness-60 border-b justify-between items-center px-5 py-3 z-2 lg:pl-[15vw] rounded-3xl'>
          <div className="nav-container">
            <input 
              value={filters.query}
              type="text" 
              className='pl-0! lg:w-12/10 w-8/10' 
              placeholder='Enter your search' 
              onChange={filters.handleInputChange}
            />
          </div>
          <div className="flex justify-between gap-4">
            <a href='#'><FiHeart className='nav-icons'/></a>
            {!isMobile ? 
            <>
              <a href='#'><AiOutlineShoppingCart className='nav-icons lg:flex'/></a>
            </> :
            <a className='cursor-pointer' 
            onClick={() => {
            toggleFilterMenu();
            }}><RxHamburgerMenu className='nav-icons'/></a>
            }
          </div>
      </nav> 
  )
}

