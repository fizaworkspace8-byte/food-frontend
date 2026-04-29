import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Banknote, Smartphone, CreditCard, ArrowRight, Trash2, Minus, Plus } from 'lucide-react';

const API = 'http://localhost:5000/api';

const Checkout = () => {
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: ''
  });

  const shippingFee = 5.99;
  const totalValue = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    // Basic Validation
    if (!shipping.email || !shipping.address || !shipping.city || !shipping.phone) {
      alert('Please fill in all required fields (Email, Address, City, and Phone).');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/orders`, {
        email: shipping.email,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total: totalValue,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_zip: shipping.zip, // Now being sent correctly[cite: 8]
        shipping_phone: shipping.phone,
        payment_method: paymentMethod,
        items: cart // This passes the array of objects to the backend[cite: 9]
      });

      // Clear the local cart state
      await clearCart();

      // Navigate to confirmation with the order number from backend
      navigate('/confirmation', {
        state: {
          orderId: res.data.order_number
        }
      });

    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data || err.message);
      // Display the specific MySQL error if available, otherwise a generic message
      alert(err.response?.data?.error || err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
    { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
    { id: 'easypaisa', label: 'EasyPaisa', icon: Smartphone },
    { id: 'nayapay', label: 'NayaPay', icon: CreditCard },
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center pt-20">
        <h2 className="text-white text-3xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => navigate('/menu')}
          className="mt-4 text-orange-500 font-bold hover:underline"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pt-32 pb-20 px-[5%]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Side: Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-black italic"
          >
            CHECKOUT
          </motion.h1>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-500 uppercase tracking-widest">Shipping Details</h3>

              <input
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-colors"
                placeholder="Email Address"
                type="email"
                value={shipping.email}
                onChange={e => setShipping({ ...shipping, email: e.target.value })}
              />

              <input
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-colors"
                placeholder="Shipping Address"
                value={shipping.address}
                onChange={e => setShipping({ ...shipping, address: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="bg-white/5 border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-colors"
                  placeholder="City"
                  value={shipping.city}
                  onChange={e => setShipping({ ...shipping, city: e.target.value })}
                />
                <input
                  className="bg-white/5 border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-colors"
                  placeholder="Phone Number"
                  value={shipping.phone}
                  onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                />
              </div>

              <input
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-colors"
                placeholder="Zip / Postal Code (Optional)"
                value={shipping.zip}
                onChange={e => setShipping({ ...shipping, zip: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-orange-500 uppercase tracking-widest">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === opt.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/10 hover:bg-white/5'
                      }`}
                  >
                    <opt.icon size={20} className={paymentMethod === opt.id ? 'text-orange-500' : 'text-gray-400'} />
                    <span className="font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 sticky top-28">
            <h2 className="text-2xl font-bold mb-6 italic uppercase tracking-tight">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-bold">{item.name || item.product_name}</span>
                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono text-orange-500">
                    ${(parseFloat(item.price || item.product_price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black italic text-white pt-2">
                <span>TOTAL</span>
                <span className="text-orange-500">${totalValue.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white py-5 rounded-full mt-8 font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? (
                'PROCESSING...'
              ) : (
                <>
                  PLACE ORDER <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;