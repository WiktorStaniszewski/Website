import { useNavigate } from 'react-router-dom';
import { AddToCartButton } from './ShopButtons';
import { FiAlertTriangle } from 'react-icons/fi';

function Card({ product }) {
    const navigate = useNavigate();
    
    const available = product.availableStock !== undefined ? product.availableStock : (product.stockQuantity || 0);
    const isSoldOut = available <= 0;
    const isLowStock = available > 0 && available <= 5;
    
    const handleCardClick = () => {
        navigate(`/shop/${product.id || product.slug}`);
    };

    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://placehold.co/150x150?text=Brak+foto';
        if (/^\d{10,}-/.test(imageName)) return `http://localhost:5000/images/products/${imageName}`;
        return `images/tempProducts/${imageName}`;
    };

    return (
        <section 
            onClick={handleCardClick}
            className={`
                group relative h-[420px] max-w-60 w-full flex flex-col cursor-pointer overflow-hidden
                bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl 
                transition-all duration-500 shadow-lg hover:shadow-[0_10px_40px_rgba(143,120,93,0.25)] hover:-translate-y-2 hover:border-(--medium-shade)
                ${isSoldOut ? 'opacity-80 grayscale-40' : ''}
            `}
        >
            {/* Tagi statusu */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                {isSoldOut && (
                    <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-xl border border-red-400/50 shadow-md">
                        Wyprzedane
                    </span>
                )}
                {isLowStock && (
                    <span className="bg-(--medium-shade)/90 backdrop-blur-sm text-[#24201d] text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 border border-(--medium-shade)">
                        <FiAlertTriangle /> Ostatnie {available} szt.
                    </span>
                )}
            </div>

            {/* Kontener zdjęcia */}
            <div className="relative w-full h-[55%] overflow-hidden bg-white/45 p-6 flex items-center justify-center">
                <img 
                    src={getImageUrl(product.image || product.img)} 
                    alt={product.name} 
                    className={`w-full h-full object-contain drop-shadow-xl transition-transform duration-700 ${isSoldOut ? '' : 'group-hover:scale-110'}`}
                    onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Brak+foto'; }}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/10 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Kontener treści */}
            <div className="p-5 flex flex-col flex-1 relative z-10 bg-linear-to-b from-transparent to-black/35">
                <h3 className="font-serif font-bold text-lg leading-tight text-(--font-color) mb-2 line-clamp-2 group-hover:text-(--medium-shade) transition-colors">
                    {product.name}
                </h3>
                
                <div className="text-xs text-(--font-color)/60 flex flex-col gap-2 mb-4">
                    {product.company && <p className="uppercase tracking-widest font-bold opacity-70 mb-1">{product.company}</p>}
                    {product.flavours && (
                        <div className="flex flex-wrap gap-1.5">
                            {product.flavours.split(',').slice(0, 3).map((flavor, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-(--medium-shade) font-medium backdrop-blur-sm">
                                    {flavor.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Cena i przycisk */}
                <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-(--font-color)/40 font-bold mb-0.5">Cena</span>
                        <p className="font-bold text-xl text-(--font-color)">
                            {product.price} <span className="text-xs text-(--font-color)/50 font-normal">PLN</span>
                        </p>
                    </div>
                    <div className="transform transition-all duration-300">
                         <AddToCartButton product={product} compact={true} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Card;