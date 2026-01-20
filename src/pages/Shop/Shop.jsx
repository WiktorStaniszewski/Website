import 'styles/Shop.css'

import Products from 'src/pages/Shop/components/ProductList'
import Navigation from 'pages/shop/components/ShopNavigation'
import Recommended from 'pages/shop/components/RecommendedSection'
import Sidebar from 'pages/shop/components/Sidebar/Sidebar'

import { useShopFilters } from 'pages/shop/hooks/useShopFilters'
import { useToggle } from '@uidotdev/usehooks'

export default function Shop() {
    const filters = useShopFilters();
    /*
        query,
        filteredProducts,
        handleInputChange,
        handleCategoryChange,
        handlePriceChange,
        handleFlavorsChange,
        handleCafeChange,
    */

    const [isFilterMenuOpen, toggleFilterMenu] = useToggle(false);

    return (
        <main className='w-screen flex justify-center lg:mt-25'>
            <div className='lg:grid lg:grid-cols-[1fr_3fr_1fr_0fr] lg:gap-0 lg:grid-rows-[auto_auto_1fr] lg:w-8/10 xl:w-75/100 mx-0 flex justify-center flex-col w-9/10'>
                <div className='lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-6 lg:h-fit'>
                    <Sidebar
                        filters={filters}
                        isFilterMenuOpen={isFilterMenuOpen} 
                        toggleFilterMenu={toggleFilterMenu}
                    />
                </div>
                <div className='lg:col-start-2 lg:col-end-5 lg:row-start-2 lg:row-end-3 '>
                    <Recommended filters={filters} />
                </div>
                <div className="lg:col-start-2 lg:col-end-5 lg:row-start-3 lg:row-end-6">
                    <Products filters={filters} />
                </div>
                <div className="lg:col-start-1 lg:col-end-5 lg:row-start-1 lg:row-end-2 bottom-0 not-lg:sticky not-lg:bottom-15 not-lg:z-4 not-lg:w-8/10">
                    <Navigation filters={filters} toggleFilterMenu={toggleFilterMenu} />
                </div>
            </div>
        </main>
    )
}