import 'styles/Shop.css'

import Products from 'src/pages/Shop/components/ProductList'
import Navigation from 'pages/shop/components/ShopNavigation'
import Recommended from 'pages/shop/components/RecommendedSection'
import Sidebar from 'src/pages/Shop/components/Sidebar'
import FilterBar from 'src/pages/Shop/components/FilterBar'

import { useShopFilters } from 'pages/shop/hooks/useShopFilters'
import { useToggle } from '@uidotdev/usehooks'

import { useScrollVisibility } from 'src/hooks/useScrollVisibility';

export default function Shop() {
    const filters = useShopFilters();

    const { visible } = useScrollVisibility();
    const [isFilterMenuOpen, toggleFilterMenu] = useToggle(false);

    return (
        <main className='w-screen flex justify-center pt-25 min-h-screen'>
            <div className='flex flex-col w-full max-w-7xl px-4 lg:px-12'>
                
                {/* Mobile Sidebar (Drawer) */}
                <Sidebar
                    filters={filters} 
                    isFilterMenuOpen={isFilterMenuOpen} 
                    toggleFilterMenu={toggleFilterMenu}
                />
                
                {/* Shop Header: Search & Navigation */}
                <div className="mt-4 mb-8">
                    <Navigation filters={filters} toggleFilterMenu={toggleFilterMenu} />
                </div>

                <div className="flex flex-col gap-2">
                    <FilterBar filters={filters} />
                </div>

                <div className='mb-6 mt-4'>
                    <Recommended filters={filters} />
                </div>

                <div className="flex flex-col gap-2">
                    <Products filters={filters} />
                </div>
                
                {/* Mobile Floating Action Button / Navigation */}
                <div className={`lg:hidden fixed bottom-14 left-0 z-9999 px-4 transition-all duration-500 ease-in-out ${
                    visible 
                        ? 'w-[75%] translate-y-0 opacity-100' 
                        : 'w-full translate-y-24 opacity-0 pointer-events-none'
                }`}>
                    <Navigation filters={filters} toggleFilterMenu={toggleFilterMenu} />
                </div>

            </div>
        </main>
    )
}