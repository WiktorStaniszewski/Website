import 'styles/Shop.css'
import Products from '../Shop/SProducts/Products.jsx'
import Navigation from '../Shop/SNavigation/Navigation.jsx'
import Recommended from '../Shop/SRecommended/Recommended.jsx'
import Sidebar from './SSidebar/Sidebar.jsx'
import { useShopFilters } from 'components/hooks/useShopFilters.jsx'

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

    

    return (
       <div className='shopContainer'>
            <Sidebar 
                handleCategoryChange={handleCategoryChange} 
                handlePriceChange={handlePriceChange} 
                handleFlavorsChange={handleFlavorsChange}
                handleCafeChange={handleCafeChange}
            />
        
            <Navigation query={query} handleInputChange={handleInputChange}/>
            <Recommended handleClick={handleCategoryChange} />
        <Products filteredProducts={filteredProducts} />
       </div>
    )
}
export default Shop