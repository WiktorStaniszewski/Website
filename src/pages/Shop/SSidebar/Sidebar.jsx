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
      <div className='flex absolute pl-4 w-1/8 mt-5 flex-col'>
        <section >
          <div className="z-4 relative mb-13 text-3xl">
              <h1><BsShop className=''/></h1>
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
      <div className='hidden'>
        <section>
          <div className="z-4 relative">
              <h1><BsShop className=''/></h1>
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
