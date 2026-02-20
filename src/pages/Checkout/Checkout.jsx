import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCart } from 'context/CartProvider';
import { useAuth } from 'context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import api from 'services/api';
import { FiArrowLeft, FiTruck, FiCreditCard, FiCheckCircle, FiBookOpen } from "react-icons/fi";

export default function Checkout() {
  const { cartItems, cartTotal, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      address: "",
      city: "",
      zip: "",
      phone: ""
    }
  });

  const [shippingMethod, setShippingMethod] = useState('courier');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, cartLoading, navigate]);

  useEffect(() => {
    if (user) {
        const fetchAddresses = async () => {
            try {
                const res = await api.get('users/profile/addresses');
                if (Array.isArray(res)) setSavedAddresses(res);
            } catch (e) {
                console.error("Błąd ładowania książki adresowej", e);
            }
        };
        fetchAddresses();
    }
  }, [user]);

  const handleAddressSelect = (e) => {
      const addrId = e.target.value;
      setSelectedAddressId(addrId);
      
      if (addrId) {
          const selectedAddr = savedAddresses.find(a => a.id.toString() === addrId);
          if (selectedAddr) {
              setValue("address", selectedAddr.street);
              setValue("city", selectedAddr.city);
              setValue("zip", selectedAddr.zip);
              setValue("phone", selectedAddr.phone);
          }
      } else {
          setValue("address", "");
          setValue("city", "");
          setValue("zip", "");
          setValue("phone", "");
      }
  };

  const shippingOptions = {
    courier: { price: 15, label: "Kurier InPost", time: "1-2 dni" },
    locker: { price: 12, label: "Paczkomaty InPost", time: "1-2 dni" },
    pickup: { price: 0, label: "Odbiór osobisty (Somnium)", time: "Gotowe w 2h" }
  };

  const currentShippingCost = shippingOptions[shippingMethod].price;
  const finalTotal = cartTotal + currentShippingCost;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    const orderPayload = {
      customer: data,
      items: cartItems,
      shipping: {
        method: shippingMethod,
        cost: currentShippingCost,
        details: shippingOptions[shippingMethod]
      },
      total: finalTotal,
      status: "new",
      date: new Date().toISOString().split('T')[0],
      userId: user?.id || null
    };

    try {
      const response = await api.post('orders', orderPayload);
      const tracking = response.trackingNumber || response.order?.trackingNumber;
      
      if (user && saveNewAddress && newAddressLabel) {
          try {
              await api.post('users/profile/addresses', {
                  label: newAddressLabel,
                  street: data.address,
                  city: data.city,
                  zip: data.zip,
                  phone: data.phone
              });
          } catch(addrErr) {
              console.error("Zamówienie się udało, ale zapisanie adresu nie:", addrErr);
          }
      }

      await clearCart();
      navigate('/order-success', { state: { trackingNumber: tracking } });
    } catch (error) {
      console.error("Order failed", error);
      alert("Wystąpił błąd podczas składania zamówienia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen flex justify-center pt-24 pb-20 text-white">
      <div className="w-9/10 max-w-7xl grid lg:grid-cols-[1.5fr_1fr] gap-10">
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          
          <section className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-(--80-shade) text-[#24201d] w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
              Dane dostawy
            </h2>
            
            {user && savedAddresses.length > 0 && (
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

              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Ulica i numer</label>
                <input 
                  {...register("address", { required: "Adres jest wymagany" })}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="ul. Kawowa 12/4"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Kod pocztowy</label>
                <input 
                  {...register("zip", { required: "Kod jest wymagany" })}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.zip ? 'border-red-500' : ''}`}
                  placeholder="00-001"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Miasto</label>
                <input 
                  {...register("city", { required: "Miasto jest wymagane" })}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Warszawa"
                />
              </div>
            </div>

            {user && !selectedAddressId && (
                <div className="mt-6 p-4 border border-(--medium-shade)/30 bg-(--medium-shade)/5 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={saveNewAddress}
                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                            className="w-5 h-5 accent-(--medium-shade) cursor-pointer"
                        />
                        <span className="font-bold text-(--medium-shade)">Zapisz ten adres na przyszłość w moim koncie</span>
                    </label>
                    
                    {saveNewAddress && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-2">Podaj krótką nazwę dla tego adresu</label>
                            <input 
                                type="text"
                                value={newAddressLabel}
                                onChange={(e) => setNewAddressLabel(e.target.value)}
                                placeholder="np. Domówka, Biuro, Moje mieszkanie"
                                required={saveNewAddress}
                                className="w-full bg-black/20 border border-(--medium-shade)/50 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors"
                            />
                        </div>
                    )}
                </div>
            )}
          </section>

         <section className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-(--80-shade) text-[#24201d] w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
              Metoda dostawy
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
                      className="accent-(--80-shade) w-5 h-5"
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
        </form>

        <div className="flex flex-col gap-6">
            <div className="bg-[#24201d]/60 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5 lg:sticky lg:top-24">
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
                                    <img src={finalImageSrc} className="w-full h-full object-cover" />
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
                    <div className="flex justify-between">
                        <span className="opacity-70">Dostawa ({shippingOptions[shippingMethod].label})</span>
                        <span>{currentShippingCost === 0 ? 'Gratis' : `${currentShippingCost.toFixed(2)} zł`}</span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-8">
                    <div className="flex justify-between text-xl font-bold">
                        <span>Do zapłaty</span>
                        <span className="text-(--medium-shade)">{finalTotal.toFixed(2)} zł</span>
                    </div>
                    <p className="text-xs opacity-50 text-right mt-1">Zawiera podatek VAT</p>
                </div>

                <button 
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-102 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(143,120,93,0.3)]"
                >
                    {isSubmitting ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
                </button>
                
                <div className="mt-4 text-center">
                    <Link to="/cart" className="text-sm opacity-60 hover:opacity-100 hover:text-(--medium-shade) flex items-center justify-center gap-2 transition-colors">
                        <FiArrowLeft /> Wróć do koszyka
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}