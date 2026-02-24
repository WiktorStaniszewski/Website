import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from 'src/services/api';
import { useAuth } from './AuthProvider';
import { useCartTimer } from './CartComponents/useCartTimer';
import { NotificationPopup } from './CartComponents/NotificationPopup';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const getSessionId = () => {
    let sid = localStorage.getItem('somnium_session_id');
    if (!sid) {
        sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('somnium_session_id', sid);
    }
    return sid;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);

  const { isAuthenticated } = useAuth(); 
  const sessionId = getSessionId();

  const { timeRemaining, setReservationExpiry } = useCartTimer(cartItems.length, () => {
      setPopupMessage({
          title: "Czas minął",
          desc: "Rezerwacja Twojego koszyka wygasła. Część produktów mogła zostać wykupiona. Sprawdzam aktualną dostępność...",
          action: async () => {
              setPopupMessage(null); 
              await syncCart(cartItems, true);
          },
          buttonText: "Odśwież koszyk"
      });
  });

  useEffect(() => {
    let isMounted = true; 

    const fetchOrMergeCart = async () => {
      setLoading(true);
      try {
        let initialItems = [];

        if (isAuthenticated && localStorage.getItem('somnium_token')) {
          const localCart = JSON.parse(localStorage.getItem('somnium_cart')) || [];
          const remoteCart = await api.get('cart'); 
          
          if (!isMounted) return;

          let mergedCart = [...(Array.isArray(remoteCart) ? remoteCart : [])];
          
          localCart.forEach(localItem => {
             const existing = mergedCart.find(item => item.id === localItem.id);
             if (existing) existing.quantity += localItem.quantity;
             else mergedCart.push(localItem);
          });

          if (localCart.length > 0) {
             await api.put('cart', undefined, { cart: mergedCart });
             localStorage.removeItem('somnium_cart'); 
          }
          initialItems = mergedCart;
        } else {
          const savedCart = localStorage.getItem('somnium_cart');
          if (savedCart) initialItems = JSON.parse(savedCart);
        }

        if (isMounted) {
             await syncCart(initialItems, false); 
        }
      } catch (error) {
        if (error.name !== 'TypeError' && !error.message.includes('NetworkError')) {
             console.error("Cart load error", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrMergeCart();

    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const syncCart = async (newItems, updateDatabase = true) => {
    let success = true; 
    
    if (updateDatabase && isAuthenticated && !localStorage.getItem('somnium_token')) {
        return false;
    }

    try {
        const response = await api.post('reservations/sync', {
            sessionId: sessionId,
            cartItems: newItems.map(item => ({ id: item.id, quantity: item.quantity }))
        });

        if (response.expiresAt && newItems.length > 0) {
            setReservationExpiry(new Date(response.expiresAt));
        } else {
            setReservationExpiry(null);
        }

        if (response.failedItems && response.failedItems.length > 0) {
            success = false; 
            const failedNames = [];
            response.failedItems.forEach(failed => {
                failedNames.push(failed.name);
                const itemIndex = newItems.findIndex(i => i.id === failed.id);
                if (itemIndex > -1) {
                    if (failed.available > 0) newItems[itemIndex].quantity = failed.available;
                    else newItems.splice(itemIndex, 1);
                }
            });
            setPopupMessage({
                title: "Ograniczona dostępność",
                desc: `Skorygowano ilość. Brak dla: ${failedNames.join(', ')}`
            });
        }
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('NetworkError')) {
            console.warn("Zignorowano błąd sieci w trakcie wylogowywania (syncCart).");
            return false;
        }
        
        console.error("Błąd systemu rezerwacji:", err);
        success = false;
        if (err.message !== "Failed to fetch") {
            setPopupMessage({ title: "Błąd serwera", desc: "Nie udało się zsynchronizować koszyka." });
        }
    }

    setCartItems([...newItems]); 
    
    if (updateDatabase) {
        if (isAuthenticated && localStorage.getItem('somnium_token')) {
          try { await api.put('cart', undefined, { cart: newItems }); } 
          catch (err) { 
              if (err.name !== 'TypeError') console.error("Failed to sync cart", err); 
          }
        } else {
          localStorage.setItem('somnium_cart', JSON.stringify(newItems));
        }
    }
    return success; 
  };

  const extendReservation = async () => {
      if (cartItems.length === 0) return;
      try {
          const response = await api.post('reservations/extend', { sessionId });
          if (response.expiresAt) setReservationExpiry(new Date(response.expiresAt));
      } catch (err) {
          console.error("Błąd przedłużania czasu:", err);
      }
  };

  const addToCart = async (product) => {
    const newItems = [...cartItems];
    const existingItem = newItems.find((item) => item.id === product.id);

    try {
        const prodData = await api.get(`products/${product.id}`);
        const maxAvailable = prodData.availableStock !== undefined ? prodData.availableStock : prodData.stockQuantity;

        if (maxAvailable < 1) {
            setPopupMessage({ title: "Maksymalna ilość", desc: `Nie możemy dodać więcej. Ktoś inny mógł zarezerwować pozostałe sztuki!` });
            return false;
        }

        if (existingItem) existingItem.quantity += 1;
        else newItems.push({ ...product, quantity: 1 });
        
        return await syncCart(newItems);
    } catch (err) {
        return false;
    }
  };

  const updateQuantity = async (id, amount) => {
    const newItems = [...cartItems];
    const itemIndex = newItems.findIndex(i => i.id === id);
    
    if (itemIndex > -1) {
        const item = newItems[itemIndex];
        const newQuantity = item.quantity + amount;

        if (newQuantity <= 0) return; 

        if (amount > 0) {
            try {
                const prodData = await api.get(`products/${id}`);
                const maxAvailable = prodData.availableStock !== undefined ? prodData.availableStock : prodData.stockQuantity;

                if (amount > maxAvailable) {
                    setPopupMessage({ title: "Brak na magazynie", desc: `Możesz dobrać jeszcze maksymalnie ${maxAvailable} szt. To wszystko co mamy!` });
                    return false;
                }
            } catch(e) { console.error(e); }
        }

        newItems[itemIndex].quantity = newQuantity;
        return await syncCart(newItems);
    }
  };

  const removeFromCart = async (id) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    await syncCart(newItems);
  };
  
  const clearCart = async (forceUpdateDB = true) => await syncCart([], forceUpdateDB); 

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, loading,
        timeRemaining, extendReservation
    }}>
      {children}
      <NotificationPopup popupMessage={popupMessage} setPopupMessage={setPopupMessage} />
    </CartContext.Provider>
  );
};