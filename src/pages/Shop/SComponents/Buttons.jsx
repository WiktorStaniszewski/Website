import React from 'react';
import { FaCartPlus } from "react-icons/fa";


export const AddToCartButton = () => { 
    return (
        <div className='flex w-full justify-center gap-4 p-4 mt-4 backdrop-brightness-150 cursor-pointer rounded-2xl hover:scale-105 hover:rotate-1 transition-all duration-200 ease-in-out add-to-cart-button'>
            <h1>Dodaj do koszyka</h1>
            <FaCartPlus className='h-8 w-8'/>
        </div>
    )
}