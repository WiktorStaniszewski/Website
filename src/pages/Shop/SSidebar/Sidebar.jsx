import 'styles/Shop.css';
import { BsShop } from "react-icons/bs";

import Category from './Category/Category';
import Price from './Price/Price';
import Flavors from './Flavors/Flavors'
import Cafe from './SCafe/Cafe';

import { useViewport } from 'src/components/hooks/useViewport';
import { FiX } from 'react-icons/fi';

function Sidebar({handleCategoryChange, handlePriceChange, handleFlavorsChange, handleCafeChange, isFilterMenuOpen, toggleFilterMenu}) {
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
      <div className={`fixed overflow-x-hidden overflow-y-auto w-full z-20 backdrop-blur-sm backdrop-brightness-60 h-full mx-2 p-4 bottom-0 text-sm ${isFilterMenuOpen ? 'bottom-0' : 'bottom-1000'} transition-all duration-400 ease-in-out`}>
        <section>
          <div className="scrollableContainer">
            <Category handleChange={handleCategoryChange} />
            <Price handleChange={handlePriceChange} />
            <Flavors handleChange={handleFlavorsChange} />
            <Cafe handleChange={handleCafeChange} />
          </div>
          <div className='flex justify-center'>
            <FiX className=' text-3xl cursor-pointer w-5/10 bottom-8 absolute border rounded-3xl' onClick={toggleFilterMenu} />
          </div>
        </section>
      </div> 
    }
    </>
  )
}

export default Sidebar
