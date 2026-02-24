import React, { useState, useEffect } from 'react';
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
  const { cartItems, cartTotal, loading: cartLoading, clearCart, timeRemaining, extendReservation } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [shippingMethod, setShippingMethod] = useState('courier');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

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
  const isTimeExpired = timeRemaining === "00:00";
  const isTimeRunningOut = timeRemaining && timeRemaining.startsWith("00:");

  useEffect(() => { if (!cartLoading && cartItems.length === 0 && !isOrderPlaced) navigate('/shop'); }, [cartItems, cartLoading, navigate, isOrderPlaced]);
  useEffect(() => { if (!cartLoading && cartItems.length > 0) extendReservation(); }, [cartLoading]);
  
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
          if (addr) { setValue("address", addr.street); setValue("city", addr.city); setValue("zip", addr.zip); setValue("phone", addr.phone); }
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
      customer: data, items: cartItems, total: finalTotal, status: "new", date: new Date().toISOString().split('T')[0],
      userId: user?.id || null, sessionId: sessionId,
      shipping: { method: shippingMethod, cost: currentShippingCost, details: shippingOptions[shippingMethod] }
    };

    try {
      const response = await api.post('orders', orderPayload);
      const tracking = response.trackingNumber || response.id;
      
      if (user && saveNewAddress && newAddressLabel && shippingMethod !== 'pickup') {
          await api.post('users/profile/addresses', { label: newAddressLabel, street: data.address, city: data.city, zip: data.zip, phone: data.phone }).catch(()=>{});
      }

      setIsOrderPlaced(true);
      await clearCart(true);
      navigate('/order-success', { state: { trackingNumber: tracking } });
    } catch (error) {
      alert("Wystąpił błąd. Sprawdź, czy produkty są dostępne.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen flex justify-center pt-24 pb-20 text-white">
      <div className="w-9/10 max-w-7xl grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <DeliveryMethod shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} shippingOptions={shippingOptions} />
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
               shippingOptions={shippingOptions} shippingMethod={shippingMethod} timeRemaining={timeRemaining} 
               isTimeExpired={isTimeExpired} isTimeRunningOut={isTimeRunningOut} isSubmitting={isSubmitting} 
               handleFormSubmit={handleSubmit(onSubmit)} navigate={navigate} 
           />
        </div>
      </div>
    </div>
  );
}