import 'styles/Shop.css'
import { FiHeart} from 'react-icons/fi'
import { AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai'
import { useViewport } from 'src/components/hooks/useViewport'

function Navigation({handleInputChange}) {
  const { isMobile } = useViewport();
  return (
    <>
    {isMobile ? 
      <nav>
        <div className="search-right-mobile">
          <div className="nav-container">
            <input 
            type="text" 
            className='search-input' 
            placeholder='Enter your search' 
            onChange={handleInputChange}
            />
          </div>
          <button>Sidebar</button>
        </div>
      </nav> 
      :
      <nav>
        <div className="search-right">
          <div className="nav-container">
            <input 
              type="text" 
              className='search-input' 
              placeholder='Enter your search' 
              onChange={handleInputChange}
            />
          </div>
        </div>
          <div className="profile-container">
            <a href='#'><FiHeart className='nav-icons'/></a>
            <a href='#'><AiOutlineShoppingCart className='nav-icons'/></a>
            <a href='#'><AiOutlineUserAdd className='nav-icons'/></a>
          </div>
      </nav> 
    }
    </>
  )
}

export default Navigation
