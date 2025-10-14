import 'styles/Shop.css';
import { BsShop } from "react-icons/bs";
import Category from './Category/Category.jsx';
import Price from './Price/Price.jsx';
import Flavors from './Flavors/Flavors.jsx'
import Cafe from './SCafe/Cafe.jsx';
import { useViewport } from 'src/components/hooks/useViewport.jsx';

function Sidebar({handleCategoryChange, handlePriceChange, handleFlavorsChange, handleCafeChange}) {
  const { isMobile } = useViewport();
  return (
    <>
    {!isMobile ? 
      <div className='shopSidebarContainer'>
        <section className="shopSidebar">
          <div className="logo-container">
              <h1><BsShop className='react-icons'/></h1>
          </div>
          <div className="scrollableContainer">
            <Category handleChange={handleCategoryChange} />
            <Price handleChange={handlePriceChange} />
            <Flavors handleChange={handleFlavorsChange} />
            <Cafe handleChange={handleCafeChange} />
          </div>
        </section>
      </div> 
      :
      <div className='shopSidebarContainer-mobile'>
        <section className="shopSidebar">
          <div className="logo-container">
              <h1><BsShop className='react-icons'/></h1>
          </div>
          <div className="scrollableContainer">
            <Category handleChange={handleCategoryChange} />
            <Price handleChange={handlePriceChange} />
            <Flavors handleChange={handleFlavorsChange} />
            <Cafe handleChange={handleCafeChange} />
          </div>
        </section>
      </div> 
    }
    </>
  )
}

export default Sidebar
