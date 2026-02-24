import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from 'context/CartProvider';

import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiClock, FiAlertTriangle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading, timeRemaining } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://placehold.co/150x150?text=Brak+foto';
    if (/^\d{10,}-/.test(imageName)) {
        return `http://localhost:5000/images/products/${imageName}`;
    }
    return `images/tempProducts/${imageName}`;
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-gray-700">Twój koszyk jest pusty</h2>
        <p className="text-gray-500">Wygląda na to, że nie dodałeś jeszcze żadnych produktów.</p>
        <Link to="/shop" className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all cursor-pointer">
          Wróć do sklepu
        </Link>
      </div>
    );
  }

  const isTimeRunningOut = timeRemaining && timeRemaining.startsWith("00:");
  const isTimeExpired = timeRemaining === "00:00";

  return (
    <div className="w-screen flex justify-center lg:mt-10 mb-20 pt-25 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-9/10 lg:w-8/10 flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 backdrop-blur-sm backdrop-brightness-75 rounded-3xl p-4 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition-colors w-max">
             <FiArrowLeft /> <Link to="/shop">Kontynuuj zakupy</Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 border-b pb-4 flex justify-between items-end">
             Twój Koszyk
             <span className="text-sm font-normal text-gray-400 hidden sm:block">Ilość produktów: {cartItems.reduce((a,b)=>a+b.quantity,0)}</span>
          </h1>

          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6 last:border-0 group">
                
                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                      src={getImageUrl(item.image || item.img)} 
                      alt={item.name || item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Brak+foto'; }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg">{item.name || item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.price} PLN</p>
                </div>

                <div className="flex items-center rounded-full px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={isTimeExpired}
                    className={`p-2 transition-all brightness-125 ${item.quantity === 1 || isTimeExpired ? 'opacity-20 cursor-not-allowed' : 'hover:text-red-500 cursor-pointer hover:brightness-140 hover:scale-125'}`}
                  >
                    <FiMinus size={19} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={isTimeExpired}
                    className={`p-2 transition-all duration-400 brightness-125 ${isTimeExpired ? 'opacity-20 cursor-not-allowed' : 'hover:brightness-140 hover:rotate-90 cursor-pointer'}`}
                  >
                    <FiPlus size={19} />
                  </button>
                </div>

                <div className="font-bold w-20 text-right">
                  {(item.price * item.quantity).toFixed(2)} zł
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer hover:bg-red-50 rounded-full"
                  title="Usuń produkt"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-(--header-footer-bg) rounded-3xl p-6 sticky top-24 shadow-md border border-gray-100">
            
            {timeRemaining && (
                <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-4 transition-colors duration-500
                    ${isTimeExpired 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                        : isTimeRunningOut 
                            ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                            : 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                    }
                `}>
                    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                        {isTimeExpired ? (
                            <FiAlertTriangle className="text-3xl relative z-10" />
                        ) : (
                            <>
                                <FiClock className="text-2xl relative z-10" />
                                <div className={`absolute inset-0 rounded-full opacity-30 ${isTimeRunningOut ? 'animate-ping bg-orange-400' : ''}`}></div>
                            </>
                        )}
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Rezerwacja koszyka</p>
                        {isTimeExpired ? (
                            <p className="text-sm font-bold leading-tight">Czas minął. Odśwież stronę.</p>
                        ) : (
                            <p className="text-xl font-mono font-bold leading-tight">{timeRemaining}</p>
                        )}
                    </div>
                </div>
            )}

            <h2 className="text-xl font-bold mb-6">Podsumowanie</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Wartość produktów:</span>
              <span className="font-medium">{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between mb-6 text-gray-600">
              <span>Dostawa:</span>
              <span className="font-bold text-green-600">Gratis</span>
            </div>
            
            <div className="border-t border-gray-300 my-4"></div>
            
            <div className="flex justify-between mb-8 text-xl font-bold">
              <span>Do zapłaty:</span>
              <span>{cartTotal.toFixed(2)} zł</span>
            </div>

            {isTimeExpired ? (
                 <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors cursor-pointer flex justify-center items-center gap-2"
                 >
                    <FiAlertTriangle /> Odśwież koszyk
                 </button>
            ) : (
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 cursor-pointer block text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                >
                  Przejdź do kasy
                </button>
            )}
            
            <p className="text-xs text-center text-gray-400 mt-4 px-4 leading-relaxed">
                Naciśnięcie "Przejdź do kasy" nie jest jednoznaczne z opłaceniem zamówienia.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}