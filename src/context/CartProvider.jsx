import React, { createContext, useContext, useState, useEffect } from 'react';
import api from 'src/services/api';
import { useAuth } from './AuthProvider';
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
        if (isMounted) await syncCart(initialItems, false); 
      } catch (error) {
        if (error.name !== 'TypeError' && !error.message.includes('NetworkError')) console.error("Cart load error", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrMergeCart();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const syncCart = async (newItems, updateDatabase = true) => {
    setCartItems([...newItems]); 
    if (updateDatabase) {
        if (isAuthenticated && localStorage.getItem('somnium_token')) {
          try { await api.put('cart', undefined, { cart: newItems }); } 
          catch (err) { if (err.name !== 'TypeError') console.error("Failed to sync cart", err); }
        } else {
          localStorage.setItem('somnium_cart', JSON.stringify(newItems));
        }
    }
    return true; 
  };

  // NAPRAWIANIE KOSZYKA (Automatycznie modyfikuje ilości lub wyrzuca produkty na podstawie danych z serwera)
  const correctCartItems = async (missingItemsArray) => {
      let newItems = [...cartItems];
      missingItemsArray.forEach(missing => {
          const index = newItems.findIndex(i => i.id === missing.id);
          if (index > -1) {
              if (missing.available > 0) {
                  newItems[index].quantity = missing.available;
              } else {
                  newItems.splice(index, 1);
              }
          }
      });
      await syncCart(newItems);
  };

  const addToCart = async (product) => {
    const newItems = [...cartItems];
    const existingItem = newItems.find((item) => item.id === product.id);

    try {
        const prodData = await api.get(`products/${product.id}`);
        const maxAvailable = prodData.stockQuantity || 0;

        if (existingItem) {
            // SPRAWDZAMY CZY ŁĄCZNA ILOŚĆ NIE PRZEKRACZA MAX
            if (existingItem.quantity + 1 > maxAvailable) {
                setPopupMessage({ title: "Brak na magazynie", desc: `Nie możesz dodać więcej! W magazynie zostało tylko ${maxAvailable} szt.` });
                return false;
            }
            existingItem.quantity += 1;
        } else {
            if (1 > maxAvailable) {
                setPopupMessage({ title: "Brak w magazynie", desc: `Ktoś inny wykupił ten towar przed chwilą!` });
                return false;
            }
            newItems.push({ ...product, quantity: 1 });
        }
        
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
                const maxAvailable = prodData.stockQuantity || 0;

                if (newQuantity > maxAvailable) {
                    setPopupMessage({ title: "Brak na magazynie", desc: `W koszyku masz już maksymalną dostępną ilość (${maxAvailable} szt.).` });
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
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, loading, setPopupMessage, correctCartItems
    }}>
      {children}
      <NotificationPopup popupMessage={popupMessage} setPopupMessage={setPopupMessage} />
    </CartContext.Provider>
  );
};