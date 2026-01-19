import React, { createContext, useContext, useState, useEffect } from 'react';
import api from 'src/services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Cart (Async)
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Try to get remote cart (if backend supports it) or fallback to local
        // For now, we simulate an API call that reads from our 'mock' persistent storage
        const savedCart = localStorage.getItem('somnium_cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        // Future: const res = await api.get('cart'); setCartItems(res.data);
      } catch (error) {
        console.error("Cart load error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Helper to persist cart (simulating API sync)
  const syncCart = async (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('somnium_cart', JSON.stringify(newItems));
    
    // Future: await api.post('cart/sync', { items: newItems });
  };

  // 2. Add Item (Async)
  const addToCart = async (product) => {
    const newItems = [...cartItems];
    const existingItem = newItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({ ...product, quantity: 1 });
    }
    
    await syncCart(newItems);
  };

  // 3. Remove Item (Async)
  const removeFromCart = async (id) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    await syncCart(newItems);
  };

  // 4. Update Quantity (Async)
  const updateQuantity = async (id, amount) => {
    const newItems = cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
      
    await syncCart(newItems);
  };

  // 5. Calculate Totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};