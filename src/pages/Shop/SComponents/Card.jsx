import { AiFillStar } from 'react-icons/ai'
import { AddToCartButton } from '../SComponents/Buttons';
import { ProductDetails } from '../SComponents/ProductDetails';
import { useToggle, useClickAway } from '@uidotdev/usehooks';
import useHeaderLogic from 'src/components/hooks/Header/useHeaderLogic';

function Card({ product }) {
    const [on, toggle] = useToggle(false);
    
    const { toggleClass } = useHeaderLogic();
    
    // Fixed: Logic to close modal and reset header style
    const ref = useClickAway(() => {
        if (on) {
            toggle(false);
            toggleClass(false); // Assuming false resets the header z-index/style
        }
    });

    // Wrapper to handle opening modal
    const handleCardClick = () => {
        toggleClass(); 
        toggle();
    };

    return (
        <>
            <section 
                className="backdrop-blur-sm backdrop-brightness-85 my-6 max-w-60 cursor-pointer rounded-3xl flex flex-col items-center card-hover-effect shadow-lg transition-all duration-200 ease-in-out hover:backdrop-brightness-75 hover:scale-102 z-30"
                onClick={handleCardClick}
            >
                <img 
                    src={"images/tempProducts/" + product.image} 
                    alt={product.name} 
                    className='w-60 p-2 rounded-3xl rounded-b-none'
                />
                
                <div className="flex flex-col justify-evenly px-2 w-full pb-4">
                    <h3 className="card-title">
                        {product.name}
                        <section className="card-reviews flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <AiFillStar key={i} className='rating-stars' />
                            ))}
                            <span className="total-reviews ml-1">5</span>
                        </section>
                    </h3>
                    
                    <section className="card-price my-2">
                        <div className="price text-sm text-gray-600">
                            <p>Smak: {product.flavours}</p>
                        </div>
                    </section>
                    
                    <p className="font-bold text-lg mb-3">{product.price} PLN</p>
                    
                    {/* PASSED PRODUCT PROP HERE */}
                    <div className="w-full flex justify-center">
                        <AddToCartButton product={product} />
                    </div>
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