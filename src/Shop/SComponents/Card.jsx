import { AiFillStar } from 'react-icons/ai'
import { FaCartPlus } from "react-icons/fa";

function Card(name, price, image) {
    return (
        <section className="card">
            <img src={"/images/"+image} alt={name} className='card-image'/>
            <div className="card-details">
            <h3 className="card-title">{name}</h3>
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
                {price}PLN
                </div>
                <FaCartPlus className='cart-icon'/>
            </section>
            </div>
        </section>
    )
}

export default Card