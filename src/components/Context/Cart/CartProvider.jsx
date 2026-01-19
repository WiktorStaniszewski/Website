import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('somnium_cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('somnium_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add Item
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // 2. Remove Item
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 3. Update Quantity
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  // 4. Calculate Totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};