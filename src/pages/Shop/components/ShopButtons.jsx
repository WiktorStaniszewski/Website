import React, { useState } from 'react';
import { FaCartPlus, FaCheck } from "react-icons/fa";
import { useCart } from 'src/context/CartProvider';

export const AddToCartButton = ({ product, compact = false, className = '' }) => { 
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation(); 

        const itemToAdd = {
            id: product.id || product.name, 
            title: product.name,
            price: Number(product.price),
            img: "images/tempProducts/" + product.image,
            ...product
        };

        addToCart(itemToAdd);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    }

    // Compact styling for Product Card (smaller, icon-focused)
    if (compact) {
        return (
            <button 
                onClick={handleAddToCart}
                className={`
                    flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg
                    ${isAdded 
                        ? 'bg-green-500 text-white' 
                        : 'bg-(--medium-shade) text-[#24201d] hover:brightness-110 hover:scale-110'
                    }
                    ${className}
                `}
                title="Dodaj do koszyka"
            >
                {isAdded ? <FaCheck size={18} /> : <FaCartPlus size={18} />}
            </button>
        );
    }

    // Default Large Button (for Product Details)
    return (
        <div 
            onClick={handleAddToCart}
            className={`
                flex w-full justify-center gap-3 px-6 py-3 mt-4 backdrop-brightness-125 cursor-pointer 
                rounded-xl transition-all duration-200 ease-in-out border border-white/10 hover:bg-white/10
                ${isAdded ? 'bg-green-600/50 text-white border-green-500/50' : 'bg-white/5'}
                ${className}
            `}
        >
            <span className='font-bold select-none text-sm md:text-base'>
                {isAdded ? "Dodano do koszyka!" : "Dodaj do koszyka"}
            </span>
            
            {isAdded ? (
                <FaCheck className='h-5 w-5 animate-bounce text-green-400'/> 
            ) : (
                <FaCartPlus className='h-5 w-5'/>
            )}
        </div>
    )
}