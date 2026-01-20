import { AiFillStar } from 'react-icons/ai'
import { AddToCartButton } from './ShopButtons';
import { ProductDetails } from 'pages/shop/components/ProductDetails';
import { useToggle, useClickAway } from '@uidotdev/usehooks'
import useHeaderLogic from 'src/hooks/Header/useHeaderLogic';

function Card({ product }) {
    const [on, toggle] = useToggle(false);
    const { toggleClass } = useHeaderLogic();
    
    const ref = useClickAway(() => {
        if (on) {
            toggle(false);
            toggleClass(false);
        }
    });

    const handleCardClick = () => {
        toggleClass(); 
        toggle();
    };

    return (
        <>
            <section 
                className="group relative h-fit backdrop-blur-md bg-white/5 border border-white/10 hover:border-(--medium-shade)/50 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 max-w-60 w-full flex flex-col"
                onClick={handleCardClick}
            >
                <div className="relative w-full h-64 overflow-hidden bg-white/5">
                    <img 
                        src={"images/tempProducts/" + product.image} 
                        alt={product.name} 
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                
                <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-xl leading-tight text-(--font-color)">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full">
                            <AiFillStar className='text-(--medium-shade) text-sm' />
                            <span className="text-xs font-bold text-white/90">5.0</span>
                        </div>
                    </div>
                    
                    <div className="text-sm text-white/60 line-clamp-2 min-h-[2.5em]">
                        <span className="font-semibold text-(--medium-shade)">Nuty:</span> {product.flavours}
                    </div>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                        <p className="font-bold text-lg text-(--font-color)">{product.price} PLN</p>
                        
                        <div className="transform translate-y-0 opacity-100 transition-all duration-300">
                             <AddToCartButton product={product} compact={true} />
                        </div>
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

export default Card;