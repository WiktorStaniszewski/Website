import React, { useState } from 'react';
import { FaCartPlus, FaCheck, FaSpinner } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { useCart } from 'context/CartProvider';

export const AddToCartButton = ({ product, compact = false, className = '' }) => { 
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const available = product.availableStock !== undefined ? product.availableStock : (product.stockQuantity || 0);
    const isSoldOut = available <= 0;

    const handleAddToCart = async (e) => {
        e.stopPropagation(); 
        if (isSoldOut || isLoading) return; 

        setIsLoading(true);

        const itemToAdd = {
            id: product.id || product.name, 
            title: product.name,
            price: Number(product.price),
            img: product.image || product.img,
            ...product
        };

        const success = await addToCart(itemToAdd);

        setIsLoading(false);

        if (success) {
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 1500);
        }
    }

    if (compact) {
        return (
            <button 
                onClick={handleAddToCart}
                disabled={isSoldOut || isLoading}
                className={`
                    flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg
                    ${isSoldOut 
                        ? 'bg-red-500/10 text-red-400 opacity-50 cursor-not-allowed border border-red-500/20' 
                        : isAdded 
                            ? 'bg-green-500 text-white' 
                            : 'bg-(--medium-shade) text-[#24201d] hover:brightness-110 hover:scale-110 cursor-pointer'
                    }
                    ${className}
                `}
                title={isSoldOut ? "Wyprzedane" : "Dodaj do koszyka"}
            >
                {isLoading ? <FaSpinner className="animate-spin" size={18} /> 
                 : isSoldOut ? <FiXCircle size={18} /> 
                 : isAdded ? <FaCheck size={18} /> 
                 : <FaCartPlus size={18} />}
            </button>
        );
    }

    return (
        <button 
            onClick={handleAddToCart}
            disabled={isSoldOut || isLoading}
            className={`
                flex w-full justify-center items-center gap-3 px-6 py-4 mt-4 cursor-pointer 
                rounded-xl transition-all duration-200 ease-in-out border font-bold text-sm md:text-base shadow-lg
                ${isSoldOut 
                    ? 'bg-red-500/10 text-red-400 border-red-500/20 cursor-not-allowed opacity-70' 
                    : isAdded 
                        ? 'bg-green-500 text-[#24201d] border-green-500' 
                        : 'bg-(--medium-shade) hover:bg-(--button-hover-bg) text-[#24201d] border-(--medium-shade)'}
                ${className}
            `}
        >
            <span className='select-none'>
                {isLoading ? "Sprawdzanie..." : isSoldOut ? "Wyprzedane" : isAdded ? "Dodano do koszyka!" : "Dodaj do koszyka"}
            </span>
            
            {isLoading ? (
                <FaSpinner className="h-5 w-5 animate-spin"/>
            ) : isSoldOut ? (
                <FiXCircle className='h-5 w-5'/>
            ) : isAdded ? (
                <FaCheck className='h-5 w-5 animate-bounce text-[#24201d]'/> 
            ) : (
                <FaCartPlus className='h-5 w-5'/>
            )}
        </button>
    )
}