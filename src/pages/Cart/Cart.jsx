import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useCart } from 'context/CartProvider';

import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiAlertCircle, FiX } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading, correctCartItems } = useCart();
  const navigate = useNavigate();

  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const [missingItems, setMissingItems] = useState([]);

  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://placehold.co/150x150?text=Brak+foto';
    if (/^\d{10,}-/.test(imageName)) {
        return `http://localhost:5000/images/products/${imageName}`;
    }
    return `images/tempProducts/${imageName}`;
  };

  const handleProceedToCheckout = async () => {
    setIsCheckingStock(true);
    setMissingItems([]);
    const sessionId = localStorage.getItem('somnium_session_id');
    const token = localStorage.getItem('somnium_token'); 

    try {
        const payload = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));
        
        const res = await fetch('http://localhost:5000/api/reservations/reserve-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ sessionId, items: payload })
        });

        const data = await res.json();

        if (!res.ok) {
            if (data.missingItems && data.missingItems.length > 0) {
                setMissingItems(data.missingItems);
            } else {
                alert(data.message || "Wystąpił nieznany problem.");
            }
            return;
        }
        
        localStorage.setItem('somnium_checkout_expires', data.expiresAt);
        navigate('/checkout');
    } catch (err) {
        alert("Błąd połączenia z serwerem.");
    } finally {
        setIsCheckingStock(false);
    }
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

  return (
    <div className="w-screen flex justify-center lg:mt-10 mb-20 pt-25 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-9/10 lg:w-8/10 flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 rounded-3xl p-4 lg:p-8 shadow-sm bg-[#24201d]/60 backdrop-blur-sm backdrop-brightness-75  ">
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
                    className={`p-2 transition-all brightness-125 ${item.quantity === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:text-red-500 cursor-pointer hover:brightness-140 hover:scale-125'}`}
                  >
                    <FiMinus size={19} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className={`p-2 transition-all duration-400 brightness-125 hover:brightness-140 hover:rotate-90 cursor-pointer`}
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
            
            <h2 className="text-xl font-bold mb-6">Podsumowanie</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Wartość produktów:</span>
              <span className="font-medium">{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between mb-6 text-gray-600">
              <span>Dostawa:</span>
              <span className="font-bold text-green-600">Obliczana w kasie</span>
            </div>
            
            <div className="border-t border-gray-300 my-4"></div>
            
            <div className="flex justify-between mb-8 text-xl font-bold">
              <span>Razem:</span>
              <span>{cartTotal.toFixed(2)} zł</span>
            </div>

            <button 
              onClick={handleProceedToCheckout}
              disabled={isCheckingStock || cartItems.length === 0}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer block text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:scale-100"
            >
              {isCheckingStock ? "Sprawdzanie dostępności..." : "Przejdź do kasy"}
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4 px-4 leading-relaxed">
                Zamówienie i towary zostaną zarezerwowane w kolejnym kroku.
            </p>
          </div>
        </div>

      </div>

      {missingItems.length > 0 && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#24201d] w-full max-w-md rounded-3xl border border-red-500/30 shadow-2xl p-6 flex flex-col animate-in zoom-in-95">
                
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 text-red-400">
                        <FiAlertCircle size={28} />
                        <h2 className="text-xl font-bold">Zmiana dostępności!</h2>
                    </div>
                    <button onClick={() => setMissingItems([])} className="text-white/50 hover:text-white cursor-pointer"><FiX size={24} /></button>
                </div>
                
                <p className="text-white/70 mb-4 text-sm">
                    Ktoś był szybszy! Zanim przeszedłeś do kasy, poniższe produkty uległy wyprzedaniu lub ich stan na magazynie jest mniejszy niż w Twoim koszyku.
                </p>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                    {missingItems.map((item, idx) => (
                        <div key={idx} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex justify-between items-center">
                            <span className="font-bold text-white truncate max-w-[150px]" title={item.name}>{item.name}</span>
                            <div className="text-right text-xs">
                                <p className="text-red-400 font-bold">Chcesz: {item.requested} szt.</p>
                                <p className="text-white/50">Zostało: {item.available} szt.</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => {
                        correctCartItems(missingItems);
                        setMissingItems([]);
                    }}
                    className="w-full bg-(--80-shade) hover:bg-(--button-hover-bg) text-black font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                    Skoryguj mój koszyk
                </button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}