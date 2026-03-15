import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useCart } from 'src/context/CartProvider';
import { useAuth } from 'src/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import api from 'src/services/api';

import { DeliveryMethod } from './components/DeliveryMethod';
import { ContactAndAddress } from './components/ContactAndAddress';
import { PaymentMethod } from './components/PaymentMethod';
import { CheckoutSummary } from './components/CheckoutSummary';

export default function Checkout() {
  const { cartItems, cartTotal, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cafeOptions, setCafeOptions] = useState([]);
  const [isCartValidating, setIsCartValidating] = useState(true);
  const [selectedCafeId, setSelectedCafeId] = useState("");
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [shippingMethod, setShippingMethod] = useState('courier');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const orderPlacedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: user?.email || "", firstName: user?.firstName || "", address: "", city: "", zip: "", phone: "" }
  });

  const shippingOptions = {
    courier: { price: 15, label: "Kurier InPost", time: "1-2 dni" },
    locker: { price: 12, label: "Paczkomaty InPost", time: "1-2 dni" },
    pickup: { price: 0, label: "Odbiór osobisty (Kawiarnia)", time: "Gotowe w 1-2h" }
  };

  const currentShippingCost = shippingOptions[shippingMethod].price;
  const finalTotal = cartTotal + currentShippingCost;
  
  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  };

  const formattedTime = formatTime(timeLeft);
  const isTimeExpired = timeLeft <= 0;
  const isTimeRunningOut = timeLeft <= 60;

  useEffect(() => {
    const validateCart = async () => {
        setIsCartValidating(true);
        try {
            const sessionId = localStorage.getItem('somnium_session_id');
            const res = await api.post('cart/validate-pickup', { cartItems, sessionId });
            setCafeOptions(res);
            
            if (res.length > 0 && !selectedCafeId) {
                setSelectedCafeId(res[0].locationId);
            }
        } catch (error) {
            console.error("Błąd weryfikacji kawiarni:", error);
        } finally {
            setIsCartValidating(false);
        }
    };
    if (cartItems.length > 0 && !cartLoading) validateCart();
  }, [cartItems, cartLoading]);

  useEffect(() => {
      const expiryString = localStorage.getItem('somnium_checkout_expires');
      const sessionId = localStorage.getItem('somnium_session_id');
      
      if (!expiryString || !sessionId) {
          navigate('/cart');
          return;
      }
      
      const expiryDate = new Date(expiryString);
      
      const timer = setInterval(() => {
          const now = new Date();
          const diffMs = expiryDate - now;
          if (diffMs <= 0) {
              clearInterval(timer);
              handleTimeExpired(sessionId);
          } else {
              setTimeLeft(Math.floor(diffMs / 1000));
          }
      }, 1000);
      
      const releaseCartOnLeave = () => {
          if (!orderPlacedRef.current) {
              const token = localStorage.getItem('somnium_token');
              fetch('http://localhost:5000/api/reservations/release-checkout', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({ sessionId }),
                  keepalive: true
              }).catch(console.error);

              localStorage.removeItem('somnium_checkout_expires');
          }
      };

      window.addEventListener('beforeunload', releaseCartOnLeave);
      window.addEventListener('popstate', releaseCartOnLeave);

      return () => {
          clearInterval(timer);
          window.removeEventListener('beforeunload', releaseCartOnLeave);
          window.removeEventListener('popstate', releaseCartOnLeave);
      };
  }, [navigate]);

  const handleTimeExpired = async (sessionId) => {
      alert("Czas na realizację zamówienia minął! Zarezerwowane produkty wróciły na półki sklepowe.");
      if (sessionId) {
          await api.post('reservations/release-checkout', { sessionId }).catch(console.error);
      }
      localStorage.removeItem('somnium_checkout_expires');
      navigate('/cart');
  };

  useEffect(() => { 
      if (!cartLoading && cartItems.length === 0 && !isOrderPlaced) navigate('/shop'); 
  }, [cartItems, cartLoading, navigate, isOrderPlaced]);
  
  useEffect(() => {
    if (user) {
        api.get('users/profile/addresses')
           .then(res => { if (Array.isArray(res)) setSavedAddresses(res); })
           .catch(() => setSavedAddresses([]));
    }
  }, [user]);

  const handleAddressSelect = (e) => {
      const addrId = e.target.value;
      setSelectedAddressId(addrId);
      if (addrId) {
          const addr = savedAddresses.find(a => a.id.toString() === addrId);
          if (addr) { 
              setValue("address", addr.street); 
              setValue("city", addr.city); 
              setValue("zip", addr.zip); 
              setValue("phone", addr.phone); 
          }
      } else {
          setValue("address", ""); setValue("city", ""); setValue("zip", ""); setValue("phone", "");
      }
  };

  const onSubmit = async (data) => {
    if (isTimeExpired) return; 
    setIsSubmitting(true);
    const sessionId = localStorage.getItem('somnium_session_id');

    if (shippingMethod === 'pickup') {
        data.address = ""; data.city = ""; data.zip = "";
    }

    const orderPayload = {
      customer: data, 
      items: cartItems, 
      total: finalTotal, 
      status: "new", 
      date: new Date().toISOString().split('T')[0],
      userId: user?.id || null, 
      sessionId: sessionId,
      locationId: shippingMethod === 'pickup' ? selectedCafeId : null,
      shipping: { method: shippingMethod, cost: currentShippingCost, details: shippingOptions[shippingMethod] }
    };

    try {
      const response = await api.post('orders', orderPayload);
      const tracking = response.trackingNumber || response.id;
      
      if (user && saveNewAddress && newAddressLabel && shippingMethod !== 'pickup') {
          await api.post('users/profile/addresses', { label: newAddressLabel, street: data.address, city: data.city, zip: data.zip, phone: data.phone }).catch(()=>{});
      }

      orderPlacedRef.current = true;
      setIsOrderPlaced(true);
      await clearCart(true);
      localStorage.removeItem('somnium_checkout_expires');
      
      navigate('/order-success', { state: { trackingNumber: tracking } });
    } catch (error) {
      alert("Wystąpił błąd zamówienia. Czas Twojej sesji w kasie mógł minąć.");
      navigate('/cart');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCafeOptions = () => {
      if (isCartValidating) {
          return <div className="animate-pulse text-white/50 font-bold p-4 text-center">Weryfikacja dostępności w kawiarniach...</div>;
      }

      if (cafeOptions.length === 0) {
          return <div className="text-red-400 font-bold p-4 text-center">Brak dostępnych kawiarni do odbioru.</div>;
      }

      return (
          <div className="flex flex-col gap-3 mt-4">
              {cafeOptions.map(cafe => {
                  let barColor = "bg-green-500";
                  if (cafe.readiness < 100 && cafe.readiness >= 50) barColor = "bg-yellow-400";
                  if (cafe.readiness < 50) barColor = "bg-red-500";
                  
                  const isSelected = String(selectedCafeId) === String(cafe.locationId);

                  return (
                      <div 
                          key={cafe.locationId} 
                          onClick={() => setSelectedCafeId(cafe.locationId)}
                          className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                              isSelected 
                              ? 'border-(--medium-shade) bg-(--medium-shade)/10' 
                              : 'border-white/10 bg-[#2D231C] hover:border-white/30'
                          }`}
                      >
                          <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-(--medium-shade)' : 'border-white/30'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-(--medium-shade)"></div>}
                                  </div>
                                  <span className={`font-bold text-lg ${isSelected ? 'text-(--medium-shade)' : 'text-white'}`}>{cafe.name}</span>
                              </div>
                              <span className="text-xs font-bold text-white/50 text-right uppercase tracking-wider">
                                  {cafe.status === 'instant' ? 'Dostępne od ręki' : 'Odbiór jutro (transfer)'}
                              </span>
                          </div>
                          
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                              <div 
                                  className={`h-full ${barColor} transition-all duration-700 ease-out`} 
                                  style={{ width: `${cafe.readiness}%` }}
                              ></div>
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  return (
    <div className="w-screen flex justify-center pt-24 pb-20 text-white">
      <div className="w-9/10 max-w-7xl grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <DeliveryMethod shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} shippingOptions={shippingOptions} />
          
          {shippingMethod === 'pickup' && (
              <div className="bg-[#24201d]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
                  <h3 className="text-xl font-bold text-white mb-2">Wybierz kawiarnię do odbioru</h3>
                  <p className="text-sm text-white/50 mb-2">Sprawdziliśmy dostępność produktów z Twojego koszyka w naszych lokalach.</p>
                  {renderCafeOptions()}
              </div>
          )}

          <ContactAndAddress 
              register={register} errors={errors} user={user} savedAddresses={savedAddresses} selectedAddressId={selectedAddressId} 
              handleAddressSelect={handleAddressSelect} saveNewAddress={saveNewAddress} setSaveNewAddress={setSaveNewAddress} 
              newAddressLabel={newAddressLabel} setNewAddressLabel={setNewAddressLabel} shippingMethod={shippingMethod} 
          />
          <PaymentMethod />
        </form>

        <div className="flex flex-col gap-6">
           <CheckoutSummary 
               cartItems={cartItems} cartTotal={cartTotal} currentShippingCost={currentShippingCost} finalTotal={finalTotal} 
               shippingOptions={shippingOptions} shippingMethod={shippingMethod} 
               timeRemaining={formattedTime}
               isTimeExpired={isTimeExpired} 
               isTimeRunningOut={isTimeRunningOut} 
               isSubmitting={isSubmitting} 
               handleFormSubmit={handleSubmit(onSubmit)} navigate={navigate} 
           />
        </div>
      </div>
    </div>
  );
}