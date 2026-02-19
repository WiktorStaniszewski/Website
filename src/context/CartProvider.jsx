import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthProvider';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuth(); 

  useEffect(() => {
    const fetchOrMergeCart = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const localCart = JSON.parse(localStorage.getItem('somnium_cart')) || [];
          
          const remoteCart = await api.get('cart'); 
          
          let mergedCart = [...(Array.isArray(remoteCart) ? remoteCart : [])];
          
          localCart.forEach(localItem => {
             const existing = mergedCart.find(item => item.id === localItem.id);
             if (existing) {
                existing.quantity += localItem.quantity;
             } else {
                mergedCart.push(localItem);
             }
          });

          if (localCart.length > 0) {
             await api.put('cart', undefined, { cart: mergedCart });
             localStorage.removeItem('somnium_cart'); 
          }

          setCartItems(mergedCart);

        } else {
          const savedCart = localStorage.getItem('somnium_cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error("Cart load error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrMergeCart();
  }, [isAuthenticated]); 

  const syncCart = async (newItems) => {
    setCartItems(newItems);
    
    if (isAuthenticated) {
      try {
        await api.put('cart', undefined, { cart: newItems });
      } catch (err) {
        console.error("Failed to sync cart to database", err);
      }
    } else {
      localStorage.setItem('somnium_cart', JSON.stringify(newItems));
    }
  };

  // 2. Add Item
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

  // 3. Remove Item
  const removeFromCart = async (id) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    await syncCart(newItems);
  };

  // 4. Update Quantity
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
  
  const clearCart = async () => {
      await syncCart([]);
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};