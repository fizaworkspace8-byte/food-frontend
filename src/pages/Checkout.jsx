import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Wallet, Truck, ShieldCheck, ArrowRight, Trash2, Phone, Minus, Plus, Banknote, Smartphone } from 'lucide-react';

const API = 'https://food-backend-gk58.onrender.com/api';

const Checkout = () => {
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { user, token } = useAuth();

  const [shipping, setShipping] = useState({
    address: '', city: '', zip: '', phone: ''
  });

  const handlePlaceOrder = async () => {
    // ❌ login check removed (since auth is removed)
    setLoading(true);

    try {
      const res = await axios.post(`${API}/orders`, {
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_zip: shipping.zip,
        shipping_phone: shipping.phone,
        payment_method: paymentMethod
      });

      await clearCart();
      navigate('/confirmation', { state: { orderId: res.data.order_number || res.data.id } });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem]"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">
            YOUR CART IS <span className="text-orange-500">VOID</span>
          </h2>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-400 transition-all"
          >
            REFILL IT NOW
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

      {/* UI stays SAME — only auth removed */}

      <div className="relative z-10 pt-32 pb-20 px-[5%] max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        <div className="lg:col-span-7 space-y-8">

          <h1 className="text-7xl font-black italic">
            FINAL <span className="text-orange-500">STEP</span>
          </h1>

          {/* SHIPPING + PAYMENT UI unchanged */}
          {/* (keep your existing JSX exactly as it is) */}

        </div>

        <div className="lg:col-span-5">
          {/* ORDER SUMMARY unchanged */}
        </div>

      </div>
    </div>
  );
};

export default Checkout;