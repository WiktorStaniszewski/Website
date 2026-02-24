import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiAlertTriangle } from "react-icons/fi";

export const CheckoutSummary = ({ 
    cartItems, cartTotal, currentShippingCost, finalTotal, shippingOptions, shippingMethod, 
    timeRemaining, isTimeExpired, isTimeRunningOut, isSubmitting, handleFormSubmit, navigate 
}) => {
  
  return (
    <div className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5 lg:sticky lg:top-24">
        {timeRemaining && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition-colors duration-500
                ${isTimeExpired ? 'bg-red-500/10 border-red-500/20 text-red-400' : isTimeRunningOut ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}
            `}>
                <div className="flex items-center gap-3">
                    {isTimeExpired ? <FiAlertTriangle className="text-xl" /> : <FiClock className="text-xl" />}
                    <span className="text-sm font-bold">{isTimeExpired ? 'Czas minął' : 'Czas na zakup'}</span>
                </div>
                <span className="text-xl font-mono font-bold">{timeRemaining}</span>
            </div>
        )}

        <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Podsumowanie</h2>
        
        <div className="max-h-60 overflow-y-auto mb-6 flex flex-col gap-4 pr-2 custom-scrollbar">
            {cartItems.map(item => {
                const imageName = item.image || item.img;
                const finalImageSrc = imageName?.includes('images/') 
                    ? (imageName.startsWith('/') ? imageName : `/${imageName}`)
                    : `images/tempProducts/${imageName}`;

                return (
                    <div key={item.id} className="flex gap-3 text-sm">
                        <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden shrink-0 border border-white/5">
                            <img src={finalImageSrc} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Brak+foto'; }} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold truncate">{item.name || item.title}</p>
                            <p className="opacity-60">{item.quantity} x {item.price} zł</p>
                        </div>
                        <div className="font-bold text-(--medium-shade)">
                            {(item.price * item.quantity).toFixed(2)} zł
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
                <span className="opacity-70">Wartość koszyka</span>
                <span>{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between text-(--medium-shade)">
                <span className="opacity-90 font-bold">Dostawa ({shippingOptions[shippingMethod].label})</span>
                <span className="font-bold">{currentShippingCost === 0 ? 'Gratis' : `${currentShippingCost.toFixed(2)} zł`}</span>
            </div>
        </div>

        <div className="border-t border-white/10 pt-4 mb-8">
            <div className="flex justify-between text-xl font-bold">
                <span>Do zapłaty</span>
                <span className="text-(--medium-shade)">{finalTotal.toFixed(2)} zł</span>
            </div>
            <p className="text-xs opacity-50 text-right mt-1">Zawiera podatek VAT</p>
        </div>

        {isTimeExpired ? (
            <button 
                onClick={() => navigate('/cart')}
                className="w-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-400 py-4 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer"
            >
                <FiAlertTriangle /> Wróć do koszyka
            </button>
        ) : (
            <button 
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className="w-full bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-102 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(143,120,93,0.3)]"
            >
                {isSubmitting ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
            </button>
        )}
        
        <div className="mt-4 text-center">
            <Link to="/cart" className="text-sm opacity-60 hover:opacity-100 hover:text-(--medium-shade) flex items-center justify-center gap-2 transition-colors">
                <FiArrowLeft /> Wróć do koszyka
            </Link>
        </div>
    </div>
  );
};