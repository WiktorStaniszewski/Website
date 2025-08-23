import 'styles/Shop.css'
import Products from '../Shop/SProducts/Products.jsx'
import Navigation from '../Shop/SNavigation/Navigation.jsx'
import Recommended from '../Shop/SRecommended/Recommended.jsx'
//import { useState } from 'react'

function Shop() {
    //const [query, setQuery] = useState("")
    

    return (
       <>
            <Navigation />
            <Recommended />
            <Products />
       </>
    )
}
export default Shop