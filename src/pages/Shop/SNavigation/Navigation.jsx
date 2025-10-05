import 'styles/Shop.css'
import { FiHeart} from 'react-icons/fi'
import { AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai'

function Navigation({handleInputChange}) {
  return (
    <>
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

          <div className="profile-container">
            <a href='#'><FiHeart className='nav-icons'/></a>
            <a href='#'><AiOutlineShoppingCart className='nav-icons'/></a>
            <a href='#'><AiOutlineUserAdd className='nav-icons'/></a>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation
