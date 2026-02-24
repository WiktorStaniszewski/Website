import React from 'react';
import { FiCreditCard } from "react-icons/fi";

export const PaymentMethod = () => {
  return (
    <section className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-(--80-shade) text-[#24201d] w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
        Płatność
      </h2>
      <div className="flex gap-4">
          <div className="p-4 border border-(--80-shade) rounded-xl flex flex-col items-center w-32 bg-(--80-shade)/10 cursor-pointer shadow-[0_0_15px_rgba(143,120,93,0.2)]">
            <FiCreditCard size={24} className="mb-2 text-(--medium-shade)"/>
            <span className="text-sm font-bold text-(--medium-shade)">Online / BLIK</span>
          </div>
          <div className="p-4 border border-white/10 rounded-xl flex flex-col items-center w-32 opacity-50 cursor-not-allowed">
            <span className="text-sm mt-6">Pobranie</span>
          </div>
      </div>
    </section>
  );
};