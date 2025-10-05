import 'styles/Shop.css'
import Products from '../Shop/SProducts/Products.jsx'
import Navigation from '../Shop/SNavigation/Navigation.jsx'
import Recommended from '../Shop/SRecommended/Recommended.jsx'
import products from './Sdb/shopData.jsx'
import Sidebar from './SSidebar/Sidebar.jsx'
import { useState, useMemo, useCallback } from 'react'
import { filteredData } from './SFunctions/ShopFunctions.jsx'

function Shop() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedPrice, setSelectedPrice] = useState(null)
    const [selectedFlavors, setSelectedFlavors] = useState(null)
    const [selectedCafe, setSelectedCafe] = useState(null)
    const [query, setQuery] = useState("")

    //Input Filter
    const handleInputChange = useCallback((e) => setQuery(e.target.value), [])

    // Radio Filter
    const handleCategoryChange = useCallback((e) => setSelectedCategory(e.target.value), [])
    const handlePriceChange = useCallback((e) => setSelectedPrice(e.target.value), [])
    const handleFlavorsChange = useCallback((e) => setSelectedFlavors(e.target.value), [])
    const handleCafeChange = useCallback((e) => setSelectedCafe(e.target.value), [])

    // Buttons Filter
    //const handleClickChange = useCallback((e) => setSelectedCategory(e.target.value), [])

    const result = useMemo(() => {
        return filteredData(products, {
            category: selectedCategory,
            price: selectedPrice,
            flavors: selectedFlavors,
            cafe: selectedCafe
            }, query)
        }, [selectedCategory, selectedPrice, selectedFlavors, selectedCafe, query])

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
        <Products result={result} />
       </div>
    )
}
export default Shop