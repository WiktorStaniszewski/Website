import 'styles/Shop.css'

import Products from '../Shop/SProducts/Products'
import Navigation from '../Shop/SNavigation/Navigation'
import Recommended from '../Shop/SRecommended/Recommended'
import Sidebar from './SSidebar/Sidebar'

import { useShopFilters } from 'src/components/hooks/Shop/useShopFilters'
import { useViewport } from 'src/components/hooks/useViewport'

export default function Shop() {
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
        <main className='w-screen flex justify-center lg:mt-2'>
            <div className='lg:grid lg:grid-cols-[1fr_3fr_1fr_0fr] lg:gap-0 lg:grid-rows-[auto_auto_1fr] w-7/10'>
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
                <div className='col-start-2 col-end-5 row-start-2 row-end-3 '>
                    <Recommended handleClick={handleCategoryChange} />
                </div>
                <div className="col-start-2 col-end-5 row-start-3 row-end-6">
                    <Products filteredProducts={filteredProducts} />
                </div>
            </>
            }
            </div>
        </main>
    )
}