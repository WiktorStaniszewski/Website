import React, { useState } from 'react';
import { FaCartPlus, FaCheck, FaSpinner } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { useCart } from 'context/CartProvider';

export const AddToCartButton = ({ product, compact = false, className = '' }) => { 
    const { addToCart, cartItems } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const itemInCart = cartItems.find(i => i.id === (product.id || product.name));
    const cartQty = itemInCart ? itemInCart.quantity : 0;
    
    const maxAvailable = product.stockQuantity || 0;
    const isSoldOut = maxAvailable <= 0;
    const isMaxReached = cartQty >= maxAvailable;

    const isDisabled = isSoldOut || isMaxReached || isLoading;

    const handleAddToCart = async (e) => {
        e.stopPropagation(); 
        if (isDisabled) return; 

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

    let btnText = "Dodaj do koszyka";
    if (isLoading) btnText = "Dodawanie...";
    else if (isSoldOut) btnText = "Wyprzedane";
    else if (isMaxReached) btnText = "Max. ilość w koszyku";
    else if (isAdded) btnText = "Dodano!";

    if (compact) {
        return (
            <button 
                onClick={handleAddToCart}
                disabled={isDisabled}
                className={`
                    flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg
                    ${isSoldOut || isMaxReached
                        ? 'bg-red-500/10 text-red-400 opacity-50 cursor-not-allowed border border-red-500/20' 
                        : isAdded 
                            ? 'bg-green-500 text-[#24201d]' 
                            : 'bg-(--medium-shade) text-[#24201d] hover:brightness-110 hover:scale-110 cursor-pointer'
                    }
                    ${className}
                `}
                title={btnText}
            >
                {isLoading ? <FaSpinner className="animate-spin" size={18} /> 
                 : (isSoldOut || isMaxReached) ? <FiXCircle size={18} /> 
                 : isAdded ? <FaCheck size={18} /> 
                 : <FaCartPlus size={18} />}
            </button>
        );
    }

    return (
        <button 
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={`
                flex w-full justify-center items-center gap-3 px-6 py-4 mt-4 
                rounded-xl transition-all duration-200 ease-in-out border font-bold text-sm md:text-base shadow-lg
                ${isSoldOut || isMaxReached
                    ? 'bg-red-500/10 text-red-400 border-red-500/20 cursor-not-allowed opacity-70' 
                    : isAdded 
                        ? 'bg-green-500 text-[#24201d] border-green-500' 
                        : 'bg-(--medium-shade) hover:bg-(--button-hover-bg) text-[#24201d] border-(--medium-shade) cursor-pointer'}
                ${className}
            `}
        >
            <span className='select-none'>{btnText}</span>
            
            {isLoading ? <FaSpinner className="h-5 w-5 animate-spin"/>
             : (isSoldOut || isMaxReached) ? <FiXCircle className='h-5 w-5'/>
             : isAdded ? <FaCheck className='h-5 w-5 animate-bounce text-[#24201d]'/> 
             : <FaCartPlus className='h-5 w-5'/>}
        </button>
    )
}