import React, { useState } from 'react';
import { FiMapPin } from "react-icons/fi";
import InPostMapModal from 'src/components/InPostMapModal';

export const DeliveryMethod = ({ shippingMethod, setShippingMethod, shippingOptions, selectedLocker, setSelectedLocker }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const openInPostMap = (e) => {
      e.preventDefault();
      setIsMapOpen(true);
  };

  const handleLockerSelect = (point) => {
      setSelectedLocker(point);
      setIsMapOpen(false);
  };

  return (
    <section className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-(--80-shade) text-[#24201d] w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
        Wybierz metodę dostawy
      </h2>
      
      <div className="flex flex-col gap-3">
        {Object.entries(shippingOptions).map(([key, option]) => (
          <div key={key} className="flex flex-col gap-2">
            <label 
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
            
            {/* Widget InPost */}
            {key === 'locker' && shippingMethod === 'locker' && (
                <div className="ml-10 p-4 bg-[#1a1715]/50 border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-2">
                    {selectedLocker ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-(--medium-shade) uppercase tracking-widest font-bold mb-1">Wybrany Paczkomat</p>
                                <p className="font-bold text-white text-lg">{selectedLocker.name}</p>
                                <p className="text-sm text-white/60">{selectedLocker.address}</p>
                            </div>
                            <button onClick={openInPostMap} className="text-sm border border-white/20 hover:border-white/50 px-4 py-2 rounded-lg transition-colors cursor-pointer">Zmień</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start gap-3">
                            <p className="text-sm text-white/70">Aby kontynuować, wskaż punkt odbioru na mapie.</p>
                            <button onClick={openInPostMap} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-yellow-400/20">
                                <FiMapPin /> Otwórz mapę InPost
                            </button>
                        </div>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>

      <InPostMapModal 
          isOpen={isMapOpen} 
          onClose={() => setIsMapOpen(false)} 
          onSelect={handleLockerSelect} 
      />
    </section>
  );
};