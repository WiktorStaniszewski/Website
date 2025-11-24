import { AiFillStar } from 'react-icons/ai'
import { FaCartPlus } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import { useToggle } from '@uidotdev/usehooks';
import { useClickAway } from '@uidotdev/usehooks';
import useHeaderLogic from 'src/components/hooks/Header/useHeaderLogic';

function Card({product}) {
    const [on, toggle] = useToggle(false);
    const ref = useClickAway(() => {
        toggle(false),
        toggleClass(true);
    });
    const { 
        toggleClass
     } = useHeaderLogic();
    
    return (
        <>
            <section className="backdrop-blur-sm backdrop-brightness-85 lg:mx-6 my-6 p-6 max-w-75 cursor-pointer rounded-3xl flex flex-col items-center card-hover-effect shadow-lg transition-all duration-200 ease-in-out hover:backdrop-brightness-75 hover:scale-102"
            onClick={() => {
                toggleClass();
                toggle();
            }}>
                <img src={"/images/tempProducts/"+product.image} alt={product.name} className='w-52 pb-4 rounded-xl'/>
                <div className="flex flex-col justify-between w-full">
                    <h3 className="card-title">
                        {product.name} {product.shop == "Body" ? <img src="/images/BodyLogo.jpg"/> : <img src="/images/Somnium/SomniumLogo.jpg"/>}
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
            <div className={`fixed w-full h-full top-0 left-0 flex justify-center items-center z-25 ${on ? 'flex backdrop-blur-sm' : 'hidden'}`}>
                <div className={`bg-(--darker-bg) w-6/10 h-9/10 rounded-3xl shadow-[1px_3px_10px_var(--header-footer-bg)] flex p-8 gap-4`}>
                    <img src={"/images/tempProducts/"+product.image} alt={product.name} className='w-full my-8 mx-4 rounded-xl'/>
                    <div className='flex flex-col justify-between mx-4 my-8'>
                        <div className='flex justify-between w-full items-center pb-4'>
                            <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
                            <div className='headerButton text-4xl' 
                            onClick={e => {
                                toggleClass();
                                toggle();
                            }}>
                                <FiX />
                            </div>
                        </div>
                        <p>{product.company}</p>
                        <p>{product.flavours}</p>
                        <p>{product.type}</p>
                        <p className="mb-4">{product.description}</p>
                        <div className="card-price">
                            <div className='text-3xl'>
                            {product.price}PLN
                            </div>
                            <FaCartPlus className='h-8 w-8'/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card