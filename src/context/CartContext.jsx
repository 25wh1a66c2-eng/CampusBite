import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Fetch cart on mount or user change
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const userId = user?.id || 1;
      const response = await api.get(`/cart?userId=${userId}`);
      if (response.data && response.data.items) {
        setItems(response.data.items);
      }
      setCartError(null);
    } catch (err) {
      console.warn('Could not fetch remote cart, maintaining local cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setCartError(null);
      const userId = user?.id || 1;
      const response = await api.post('/cart/items', {
        productId: product.id,
        quantity,
        userId,
      });

      if (response.data && response.data.items) {
        setItems(response.data.items);
      }
      return { success: true };
    } catch (err) {
      setCartError(err.message);
      throw err;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity, availableStock) => {
    try {
      setCartError(null);
      if (availableStock !== undefined && newQuantity > availableStock) {
        throw new Error(`Cannot add more than ${availableStock} portions available in stock.`);
      }

      const userId = user?.id || 1;
      const response = await api.put(`/cart/items/${itemId}?userId=${userId}`, {
        quantity: newQuantity,
      });

      if (response.data && response.data.items) {
        setItems(response.data.items);
      }
      return { success: true };
    } catch (err) {
      setCartError(err.message);
      throw err;
    }
  };

  // Remove item
  const removeFromCart = async (itemId) => {
    try {
      setCartError(null);
      const userId = user?.id || 1;
      const response = await api.delete(`/cart/items/${itemId}?userId=${userId}`);
      if (response.data && response.data.items) {
        setItems(response.data.items);
      }
    } catch (err) {
      setCartError(err.message);
      throw err;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const userId = user?.id || 1;
      await api.delete(`/cart?userId=${userId}`);
      setItems([]);
    } catch (err) {
      setItems([]);
    }
  };

  // Computed properties
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const grandTotal = subtotal; // Can add delivery fee if applicable or ₹0 for campus pickup!

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        cartError,
        subtotal,
        grandTotal,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
