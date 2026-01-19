import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from "react-icons/fi";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || "---";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--darker-bg) text-(--font-color)">
      <div className="text-center p-8 max-w-lg">
        <div className="flex justify-center mb-6">
           <FiCheckCircle className="text-6xl text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Dziękujemy za zamówienie!</h1>
        <p className="opacity-70 mb-8">
          Twoje zamówienie zostało przyjęte do realizacji. Potwierdzenie wysłaliśmy na Twój adres email.
        </p>

        <div className="bg-(--header-footer-bg) p-6 rounded-2xl mb-8 border border-white/5">
           <p className="text-sm uppercase tracking-wider opacity-50 mb-1">Numer zamówienia</p>
           <p className="text-2xl font-mono font-bold">#{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/account?tab=history" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center justify-center gap-2">
              <FiPackage /> Status zamówienia
           </Link>
           <Link to="/shop" className="px-6 py-3 bg-(--80-shade) hover:bg-(--button-hover-bg) rounded-xl transition-colors">
              Wróć do sklepu
           </Link>
        </div>
      </div>
    </div>
  );
}