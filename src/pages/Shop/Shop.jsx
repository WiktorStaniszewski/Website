import 'styles/Shop.css'
import Products from '../Shop/SProducts/Products.jsx'
import Navigation from '../Shop/SNavigation/Navigation.jsx'
import Recommended from '../Shop/SRecommended/Recommended.jsx'
import Sidebar from './SSidebar/Sidebar.jsx'
import { useShopFilters } from 'src/components/hooks/Shop/useShopFilters.jsx'
import { useViewport } from 'src/components/hooks/useViewport.jsx'

function Shop() {
    const {
        query,
        filteredProducts,
        handleInputChange,
        handleCategoryChange,
        handlePriceChange,
        handleFlavorsChange,
        handleCafeChange,
    } = useShopFilters();

    const { isMobile } = useViewport();
    

    return (
       <section className='lg:grid lg:grid-cols-[1fr_2fr_2fr_1fr] lg:gap-0 lg:grid-rows-[auto_auto_1fr] w-screen'>
        {isMobile ? 
        <>
            <Sidebar
                handleCategoryChange={handleCategoryChange} 
                handlePriceChange={handlePriceChange} 
                handleFlavorsChange={handleFlavorsChange}
                handleCafeChange={handleCafeChange}
            />  
            <Recommended handleClick={handleCategoryChange} />
            <Products filteredProducts={filteredProducts} />   
            <Navigation query={query} handleInputChange={handleInputChange}/>      
        </>
        :
        <>
            <div className='col-start-1 col-end-2 row-start-1 row-end-6 h-fit'>
                <Sidebar
                    handleCategoryChange={handleCategoryChange} 
                    handlePriceChange={handlePriceChange} 
                    handleFlavorsChange={handleFlavorsChange}
                    handleCafeChange={handleCafeChange}
                />  
            </div>
            <div className="col-start-1 col-end-5 row-start-1 row-end-2">
                <Navigation query={query} handleInputChange={handleInputChange}/>
            </div>
            <div className='col-start-2 col-end-5 row-start-2 row-end-3'>
                <Recommended handleClick={handleCategoryChange} />
            </div>
            <div className="col-start-2 col-end-5 row-start-3 row-end-6">
                <Products filteredProducts={filteredProducts} />
            </div>
        </>
        }
       </section>
    )
}
export default Shop