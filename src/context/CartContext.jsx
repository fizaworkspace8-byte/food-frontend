/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API = 'http://localhost:5000/api';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const { token, user } = useAuth();

  // Fetch cart from server when user logs in
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      setSubtotal(0);
      return;
    }
    setCartLoading(true);
    try {
      const res = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    if (!token) {
      // Guest mode: local cart
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        let newCart;
        if (existing) {
          newCart = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
          newCart = [...prev, { ...product, quantity: 1 }];
        }
        setSubtotal(newCart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0));
        return newCart;
      });
      return;
    }

    try {
      const res = await axios.post(`${API}/cart`, 
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) {
      setCart(prev => {
        const newCart = prev.filter(item => item.id !== productId);
        setSubtotal(newCart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0));
        return newCart;
      });
      return;
    }

    try {
      const res = await axios.delete(`${API}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) {
      setCart(prev => {
        const newCart = prev.map(item => item.id === productId ? { ...item, quantity } : item);
        setSubtotal(newCart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0));
        return newCart;
      });
      return;
    }

    try {
      const res = await axios.put(`${API}/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const clearCart = async () => {
    if (!token) {
      setCart([]);
      setSubtotal(0);
      return;
    }

    try {
      await axios.delete(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]);
      setSubtotal(0);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, subtotal, cartLoading, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
