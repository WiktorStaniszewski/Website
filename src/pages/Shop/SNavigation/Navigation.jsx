import 'styles/Shop.css'
import { FiHeart} from 'react-icons/fi'
import { AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai'
import { RxHamburgerMenu } from "react-icons/rx";
import { useViewport } from 'src/components/hooks/useViewport'

function Navigation({handleInputChange}) {
  const { isMobile } = useViewport();
  return (
    <>
      <nav className='flex sticky bottom-4 lg:top-16 backdrop-blur-lg backdrop-brightness-60 border-b justify-between items-center px-5 py-3 z-2 lg:pl-[15vw] rounded-3xl'>
        <div className="w-screen">
          <div className="nav-container">
            <input 
              type="text" 
              className='pl-0!' 
              placeholder='Enter your search' 
              onChange={handleInputChange}
            />
          </div>
        </div>
          <div className="flex justify-between gap-4">
            <a href='#'><FiHeart className='nav-icons'/></a>
            {!isMobile ? 
            <>
              <a href='#'><AiOutlineShoppingCart className='nav-icons lg:flex'/></a>
              <a href='#'><AiOutlineUserAdd className='nav-icons lg:flex'/></a>
            </> :
            <a href='#'><RxHamburgerMenu className='nav-icons'/></a>
            }
          </div>
      </nav> 
    </>
  )
}

export default Navigation
