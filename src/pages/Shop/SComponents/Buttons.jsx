import React, { useState } from 'react';
import { FaCartPlus, FaCheck } from "react-icons/fa";
import { useCart } from 'src/components/Context/Cart/CartProvider';

export const AddToCartButton = ({ product }) => { 
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

    return (
        <div 
            onClick={handleAddToCart}
            className={`flex w-full justify-center gap-4 p-4 mt-4 backdrop-brightness-150 cursor-pointer rounded-2xl transition-all duration-200 ease-in-out add-to-cart-button
            ${isAdded ? 'bg-green-600/50 text-white backdrop-brightness-100!' : ''}`}
        >
            <h1 className='select-none'>{isAdded ? "Dodano!" : "Dodaj do koszyka"}</h1>
            
            {isAdded ? (
                <FaCheck className='h-8 w-8 animate-bounce'/> 
            ) : (
                <FaCartPlus className='h-8 w-8'/>
            )}
        </div>
    )
}