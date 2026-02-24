import { AiFillStar } from 'react-icons/ai'
import { AddToCartButton } from './ShopButtons';
import { ProductDetails } from './ProductDetails';
import { useToggle, useClickAway } from '@uidotdev/usehooks'
import useHeaderLogic from 'hooks/Header/useHeaderLogic';
import { FiAlertTriangle } from 'react-icons/fi';

function Card({ product }) {
    const [on, toggle] = useToggle(false);
    const { toggleClass } = useHeaderLogic();
    
    const available = product.availableStock !== undefined ? product.availableStock : (product.stockQuantity || 0);
    const isSoldOut = available <= 0;
    const isLowStock = available > 0 && available <= 5;
    
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

    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://placehold.co/150x150?text=Brak+foto';
        if (/^\d{10,}-/.test(imageName)) return `http://localhost:5000/images/products/${imageName}`;
        return `images/tempProducts/${imageName}`;
    };

    return (
        <>
            <section 
                className={`group relative h-fit backdrop-blur-md bg-white/5 border border-white/10 hover:border-(--medium-shade)/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 max-w-60 w-full flex flex-col ${isSoldOut ? 'opacity-75 grayscale-30' : 'cursor-pointer'}`}
                onClick={handleCardClick}
            >
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {isSoldOut && (
                        <span className="bg-red-500/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-red-400/50 shadow-lg">
                            Wyprzedane
                        </span>
                    )}
                    {isLowStock && (
                        <span className="bg-orange-500/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-orange-400/50 shadow-lg flex items-center gap-1">
                            <FiAlertTriangle /> Ostatnie {available} szt.
                        </span>
                    )}
                </div>

                <div className="relative w-full h-64 overflow-hidden bg-white/5">
                    <img 
                        src={getImageUrl(product.image || product.img)} 
                        alt={product.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${isSoldOut ? '' : 'group-hover:scale-110'}`}
                        onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Brak+foto'; }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                
                <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-xl leading-tight text-(--font-color)">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full shrink-0">
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