import 'styles/Shop.css'
import React from 'react'

import Products from 'src/pages/Shop/components/ProductList'
import Navigation from 'src/pages/Shop/components/ShopNavigation'
import Recommended from 'src/pages/Shop/components/RecommendedSection'
import Sidebar from 'src/pages/Shop/components/Sidebar'
import FilterBar from 'src/pages/Shop/components/FilterBar'

import { useShopFilters } from 'src/pages/Shop/hooks/useShopFilters'
import { useToggle } from '@uidotdev/usehooks'

import { useScrollVisibility } from 'src/hooks/useScrollVisibility';

function Shop() {
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

                <div className='mt-4'>
                    <Recommended filters={filters} />
                </div>

                <div className="flex flex-col gap-2">
                    <Products filters={filters} />
                </div>
                
                {/* Mobile Floating Action Button / Navigation */}
                <div className={`lg:hidden fixed bottom-25 left-0 z-30 px-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    (visible && !isFilterMenuOpen)
                        ? 'w-[calc(100%-80px)] translate-y-0 opacity-100 scale-100' 
                        : 'w-full translate-y-24 opacity-0 scale-95 pointer-events-none'
                }`}>
                    <Navigation filters={filters} toggleFilterMenu={toggleFilterMenu} />
                </div>

            </div>
        </main>
    )
}

export default React.memo(Shop);