import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from 'src/context/CartProvider';

import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
        <FaSpinner className="animate-spin text-4xl text-gray-400" />
        <p className="text-gray-500">Ładowanie koszyka...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Twój koszyk jest pusty</h2>
        <p className="text-gray-500">Wygląda na to, że nie dodałeś jeszcze żadnych produktów.</p>
        <Link to="/shop" className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all">
          Wróć do sklepu
        </Link>
      </div>
    );
  }

  return (
    <div className="w-screen flex justify-center lg:mt-10 mb-20 pt-25">
      <div className="w-9/10 lg:w-8/10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Cart Items */}
        <div className="flex-1 backdrop-blur-sm backdrop-brightness-75 rounded-3xl p-4 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition-colors">
             <FiArrowLeft /> <Link to="/shop">Kontynuuj zakupy</Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 border-b pb-4">Twój Koszyk</h1>

          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6 last:border-0">
                {/* Image */}
                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={item.image ? `images/tempProducts/${item.image}` : item.img} alt={item.name || item.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg">{item.name || item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.price} PLN</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center rounded-full px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className={`p-2 hover:text-red-500 cursor-pointer  transition-all brightness-125 ${item.quantity === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:brightness-140 hover:scale-125'}`}
                  >
                    <FiMinus size={19} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 hover:brightness-140 hover:rotate-90 transition-all duration-400 cursor-pointer brightness-125"
                  >
                    <FiPlus size={19} />
                  </button>
                </div>

                {/* Price Calculation */}
                <div className="font-bold w-20 text-right">
                  {(item.price * item.quantity).toFixed(2)} zł
                </div>

                {/* Remove */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="lg:w-1/3">
          <div className="bg-(--header-footer-bg) rounded-3xl p-6 sticky top-24 shadow-md">
            <h2 className="text-xl font-bold mb-6">Podsumowanie</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Wartość produktów:</span>
              <span>{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between mb-6 text-gray-600">
              <span>Dostawa:</span>
              <span>Gratis</span>
            </div>
            
            <div className="border-t border-gray-300 my-4"></div>
            
            <div className="flex justify-between mb-8 text-xl font-bold">
              <span>Do zapłaty:</span>
              <span>{cartTotal.toFixed(2)} zł</span>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 cursor-pointer block text-center"
            >
              Przejdź do kasy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}