import { AiFillStar } from 'react-icons/ai'

import { AddToCartButton } from '../SComponents/Buttons';
import { ProductDetails } from '../SComponents/ProductDetails';

import { useToggle } from '@uidotdev/usehooks';
import { useClickAway } from '@uidotdev/usehooks';
import useHeaderLogic from 'src/components/hooks/Header/useHeaderLogic';

function Card({product}) {
    const [on, toggle] = useToggle(false);
    const ref = useClickAway(() => {
        if (on) toggle(false),
        toggleClass(true);
    });
    const { 
        toggleClass
     } = useHeaderLogic();
    
    return (
        <>
            <section className="backdrop-blur-sm backdrop-brightness-85 lg:mx-6 my-6 p-6 max-w-75 cursor-pointer rounded-3xl flex flex-col items-center card-hover-effect shadow-lg transition-all duration-200 ease-in-out hover:backdrop-brightness-75 hover:scale-102
            z-30"
            onClick={() => {
                toggleClass();
                toggle();
            }}>
                    <img src={"images/tempProducts/"+product.image} alt={product.name} className='w-52 pb-4 rounded-xl'/>
                <div className="flex flex-col justify-center w-full ">
                    <h3 className="card-title">
                        {product.name} 
                        <section className="card-reviews flex items-center">
                            <AiFillStar className='rating-stars' />
                            <AiFillStar className='rating-stars' />
                            <AiFillStar className='rating-stars' />
                            <AiFillStar className='rating-stars' />
                            <AiFillStar className='rating-stars' />
                            <span className="total-reviews">5</span>
                        </section>
                    </h3>
                    {product.price}PLN
                    <section className="card-price">
                        <div className="price">
                        <p>Smak: {product.flavours}</p>
                        </div>
                    </section>
                    <AddToCartButton />
                </div>
            </section>
            <ProductDetails 
                product={product} 
                on={on} 
                toggle={toggle} 
                toggleClass={toggleClass}
                ref={ref}
            />
        </>
    )
}



export default Card