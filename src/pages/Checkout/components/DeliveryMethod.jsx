import React from 'react';

export const DeliveryMethod = ({ shippingMethod, setShippingMethod, shippingOptions }) => {
  return (
    <section className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-(--80-shade) text-[#24201d] w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
        Wybierz metodę dostawy
      </h2>
      
      <div className="flex flex-col gap-3">
        {Object.entries(shippingOptions).map(([key, option]) => (
          <label 
            key={key} 
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              shippingMethod === key 
              ? 'border-(--80-shade) bg-(--80-shade)/10' 
              : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <input 
                type="radio" 
                name="shipping" 
                value={key}
                checked={shippingMethod === key}
                onChange={() => setShippingMethod(key)}
                className="accent-(--80-shade) w-5 h-5 cursor-pointer"
              />
              <div>
                <div className="font-bold">{option.label}</div>
                <div className="text-xs opacity-60">{option.time}</div>
              </div>
            </div>
            <div className="font-bold">{option.price === 0 ? 'Gratis' : `${option.price} zł`}</div>
          </label>
        ))}
      </div>
    </section>
  );
};