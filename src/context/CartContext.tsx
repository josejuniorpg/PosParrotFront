'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: number;
  image?: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart([...newCart]);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((p) => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        prevCart.push({ ...product, quantity: product.quantity });
      }
      updateCart([...prevCart]);
      return [...prevCart];
    });
  };

  const removeFromCart = (id: number) => {
    updateCart(cart.filter((product) => product.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    const updatedCart = cart.map((product) =>
      product.id === id ? { ...product, quantity: Math.max(1, quantity) } : product
    );
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
