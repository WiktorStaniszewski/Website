import React from 'react';
import { FiBookOpen } from "react-icons/fi";

export const ContactAndAddress = ({ 
    register, errors, user, savedAddresses, selectedAddressId, handleAddressSelect, 
    saveNewAddress, setSaveNewAddress, newAddressLabel, setNewAddressLabel, shippingMethod 
}) => {
  const isPickup = shippingMethod === 'pickup';

  return (
    <section className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5 animate-in fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-(--80-shade) text-[#24201d] w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
        {isPickup ? 'Dane kontaktowe' : 'Dane dostawy'}
      </h2>
      
      {/* Książka adresowa zika, gdy odbieramy osobiście */}
      {!isPickup && user && savedAddresses.length > 0 && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <FiBookOpen className="text-(--medium-shade) text-2xl hidden sm:block" />
              <div className="w-full">
                  <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block font-bold text-(--medium-shade)">Książka Adresowa</label>
                  <select 
                      value={selectedAddressId} 
                      onChange={handleAddressSelect}
                      className="w-full bg-black/30 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-(--medium-shade) transition-colors cursor-pointer"
                  >
                      <option value="">-- Wpisz nowy adres ręcznie poniżej --</option>
                      {savedAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                              {addr.label} ({addr.street}, {addr.city})
                          </option>
                      ))}
                  </select>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dane Kontaktowe (Zawsze widoczne) */}
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Imię i Nazwisko</label>
          <input 
            {...register("firstName", { required: "To pole jest wymagane" })}
            className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder="Jan Kowalski"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Email</label>
          <input 
            {...register("email", { 
              required: "Email jest wymagany",
              pattern: { value: /^\S+@\S+$/i, message: "Niepoprawny email" }
            })}
            className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.email ? 'border-red-500' : ''}`}
            placeholder="jan@example.com"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Telefon</label>
          <input 
            {...register("phone", { required: "Telefon jest wymagany" })}
            className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="+48 123 456 789"
          />
        </div>

        {/* Pola Adresowe (Ukryte przy odbiorze osobistym) */}
        {!isPickup && (
            <>
              <div className="md:col-span-2 mt-2">
                <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Ulica i numer</label>
                <input 
                  {...register("address", { required: !isPickup ? "Adres jest wymagany" : false })}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="ul. Kawowa 12/4"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Kod pocztowy</label>
                <input 
                  {...register("zip", { required: !isPickup ? "Kod jest wymagany" : false })}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.zip ? 'border-red-500' : ''}`}
                  placeholder="00-001"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Miasto</label>
                <input 
                  {...register("city", { required: !isPickup ? "Miasto jest wymagane" : false })}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Warszawa"
                />
              </div>
            </>
        )}
      </div>

      {/* Zapisywanie adresu - tylko gdy to nie jest pickup */}
      {!isPickup && user && !selectedAddressId && (
          <div className="mt-6 p-4 border border-(--medium-shade)/30 bg-(--medium-shade)/5 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                      type="checkbox" 
                      checked={saveNewAddress}
                      onChange={(e) => setSaveNewAddress(e.target.checked)}
                      className="w-5 h-5 accent-(--medium-shade) cursor-pointer"
                  />
                  <span className="font-bold text-(--medium-shade)">Zapisz ten adres na przyszłość</span>
              </label>
              
              {saveNewAddress && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Krótka nazwa</label>
                      <input 
                          type="text"
                          value={newAddressLabel}
                          onChange={(e) => setNewAddressLabel(e.target.value)}
                          placeholder="np. Dom, Biuro"
                          required={saveNewAddress}
                          className="w-full bg-black/20 border border-(--medium-shade)/50 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors"
                      />
                  </div>
              )}
          </div>
      )}
    </section>
  );
};