import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCart } from 'src/context/CartProvider';
import { useAuth } from 'src/context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import api from 'src/services/api';
import { FiArrowLeft, FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi";

export default function Checkout() {
  const { cartItems, cartTotal, loading: cartLoading, setCartItems } = useCart(); // Assuming setCartItems is exposed or we clear via a method
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
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

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, cartLoading, navigate]);

  // Shipping Costs
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
      userId: user?.id || 'guest'
    };

    try {
      // 1. Send Order to Backend
      await api.post('orders', orderPayload);
      
      // 2. Clear Cart (You might need to expose a clearCart function in CartProvider, 
      //    for now we simulate it or manually set empty if exposed, 
      //    otherwise relying on localStorage clearing in the next step)
      localStorage.removeItem('somnium_cart'); 
      window.dispatchEvent(new Event("storage")); // Trigger update if CartProvider listens to storage
      
      // 3. Navigate to Success
      navigate('/order-success', { state: { orderId: Date.now() } }); // Mock ID
    } catch (error) {
      console.error("Order failed", error);
      alert("Wystąpił błąd podczas składania zamówienia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen flex justify-center pt-24 pb-20 text-(--font-color)">
      <div className="w-9/10 max-w-7xl grid lg:grid-cols-[1.5fr_1fr] gap-10">
        
        {/* LEFT COLUMN: FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          
          {/* 1. Contact & Address */}
          <section className="bg-(--header-footer-bg) p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-(--80-shade) text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
              Dane dostawy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm opacity-70 ml-2">Imię i Nazwisko</label>
                <input 
                  {...register("firstName", { required: "To pole jest wymagane" })}
                  className={`loginInput w-full ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label className="text-sm opacity-70 ml-2">Email</label>
                <input 
                  {...register("email", { 
                    required: "Email jest wymagany",
                    pattern: { value: /^\S+@\S+$/i, message: "Niepoprawny email" }
                  })}
                  className={`loginInput w-full ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label className="text-sm opacity-70 ml-2">Telefon</label>
                <input 
                  {...register("phone", { required: "Telefon jest wymagany" })}
                  className={`loginInput w-full ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+48 123 456 789"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm opacity-70 ml-2">Ulica i numer</label>
                <input 
                  {...register("address", { required: "Adres jest wymagany" })}
                  className={`loginInput w-full ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="ul. Kawowa 12/4"
                />
              </div>

              <div>
                <label className="text-sm opacity-70 ml-2">Kod pocztowy</label>
                <input 
                  {...register("zip", { required: "Kod jest wymagany" })}
                  className={`loginInput w-full ${errors.zip ? 'border-red-500' : ''}`}
                  placeholder="00-001"
                />
              </div>

              <div>
                <label className="text-sm opacity-70 ml-2">Miasto</label>
                <input 
                  {...register("city", { required: "Miasto jest wymagane" })}
                  className={`loginInput w-full ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Warszawa"
                />
              </div>
            </div>
          </section>

          {/* 2. Shipping Method */}
          <section className="bg-(--header-footer-bg) p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-(--80-shade) text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
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

          {/* 3. Payment (Visual Only for now) */}
          <section className="bg-(--header-footer-bg) p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-(--80-shade) text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
              Płatność
            </h2>
            <div className="flex gap-4">
               <div className="p-4 border border-(--80-shade) rounded-xl flex flex-col items-center w-32 bg-(--80-shade)/10 cursor-pointer">
                  <FiCreditCard size={24} className="mb-2"/>
                  <span className="text-sm font-bold">Online / BLIK</span>
               </div>
               <div className="p-4 border border-white/10 rounded-xl flex flex-col items-center w-32 opacity-50 cursor-not-allowed">
                  <span className="text-sm">Pobranie</span>
               </div>
            </div>
          </section>
        </form>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="flex flex-col gap-6">
            <div className="bg-(--header-footer-bg) p-6 lg:p-8 rounded-3xl shadow-lg border border-white/5 sticky top-24">
                <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Podsumowanie</h2>
                
                {/* Mini Cart List */}
                <div className="max-h-60 overflow-y-auto mb-6 flex flex-col gap-4 pr-2 custom-scrollbar">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-3 text-sm">
                             <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden shrink-0">
                                <img src={item.image ? `images/tempProducts/${item.image}` : item.img} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                <p className="font-bold truncate">{item.name || item.title}</p>
                                <p className="opacity-60">{item.quantity} x {item.price} zł</p>
                             </div>
                             <div className="font-bold">
                                {(item.price * item.quantity).toFixed(2)} zł
                             </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
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
                        <span>{finalTotal.toFixed(2)} zł</span>
                    </div>
                    <p className="text-xs opacity-50 text-right mt-1">Zawiera podatek VAT</p>
                </div>

                <button 
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full bg-(--80-shade) hover:bg-(--button-hover-bg) text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-102 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
                </button>
                
                <div className="mt-4 text-center">
                    <Link to="/cart" className="text-sm opacity-60 hover:opacity-100 flex items-center justify-center gap-2">
                        <FiArrowLeft /> Wróć do koszyka
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}