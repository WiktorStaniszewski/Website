import '../styles/Shop.css'
import Products from '../Shop/SProducts/Products.jsx'
import Navigation from '../Shop/SNavigation/Navigation.jsx'
import Recommended from '../Shop/SRecommended/Recommended.jsx'

function Shop() {
    return (
       <>
            <Navigation />
            <Recommended />
            <Products />
       </>
    )
}
export default Shop






        /*<div className="shop-container">
            <div className="grid-products-container">
                {products.map((item) => 
                    <div key={item.name} className="shop-item">
                        <div className="image-container">
                            <img className="item-image" src={item.image} alt={item.name} />
                        </div>
                        <div className="other-traits">
                            <div className="item-name">{item.name}</div>
                            <div className="item-roastery">{item.roastery}</div>
                            <div className="item-price">{item.price}PLN</div>
                        </div>
                    </div>
                    )}
            </div>
        </div>
        */