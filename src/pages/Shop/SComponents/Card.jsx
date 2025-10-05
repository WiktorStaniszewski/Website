import { AiFillStar } from 'react-icons/ai'
import { FaCartPlus } from "react-icons/fa";

function Card({product}) {
    return (
        <section className="card">
            <img src={"/images/"+product.image} alt={product.name} className='card-image'/>
            <div className="card-details">
            <h3 className="card-title">
                {product.name} {product.shop == "Body" ? <img src="/images/BodyLogo.jpg"/> : <img src="/images/SomniumLogo.jpg"/>}
            </h3>
            <section className="card-reviews">
                <AiFillStar className='rating-stars' />
                <AiFillStar className='rating-stars' />
                <AiFillStar className='rating-stars' />
                <AiFillStar className='rating-stars' />
                <AiFillStar className='rating-stars' />
                <span className="total-reviews">5</span>
            </section>
            <section className="card-price">
                <div className="price">
                {product.price}PLN
                </div>
                <FaCartPlus className='cart-icon'/>
            </section>
            </div>
        </section>
    )
}

export default Card