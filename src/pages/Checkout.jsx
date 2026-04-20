import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet, Truck, ShieldCheck, ArrowRight, Trash2, Phone, Minus, Plus, Banknote, Smartphone } from 'lucide-react';

const API = 'http://localhost:5000/api';

const Checkout = () => {
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [shipping, setShipping] = useState({
    address: '', city: '', zip: '', phone: ''
  });

  // Pre-fill shipping info from user profile
  useEffect(() => {
    if (user) {
      setShipping({
        address: user.address || '',
        city: user.city || '',
        zip: user.zip || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    console.log('CALLING ORDER API', { shipping, paymentMethod });
    try {
      const res = await axios.post(`${API}/orders`, {
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_zip: shipping.zip,
        shipping_phone: shipping.phone,
        payment_method: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Cart is cleared server-side, sync local state
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
          <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">YOUR CART IS <span className="text-orange-500">VOID</span></h2>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-400 transition-all transform hover:scale-110"
          >
            REFILL IT NOW
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-orange-500">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 pt-32 pb-20 px-[5%] max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Left: Details */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-7xl font-black italic mb-2 tracking-tighter leading-none">
              FINAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">STEP</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-12 bg-orange-500"></span>
              <p className="text-gray-500 uppercase tracking-[0.4em] text-xs font-bold">Secure Gourmet Logistics</p>
            </div>
          </motion.div>

          {/* Shipping Glass Card */}
          <section className="group backdrop-blur-2xl bg-white/[0.03] p-8 md:p-10 rounded-[2.5rem] border border-white/10 hover:border-orange-500/30 transition-all duration-500 shadow-2xl">
            <div className="flex items-center gap-4 text-orange-500 mb-10">
              <div className="p-3 bg-orange-500/10 rounded-2xl ring-1 ring-orange-500/50">
                <Truck size={28} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Delivery Node</h3>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {/* Address Input */}
              <div className="relative group/input">
                <input
                  required
                  placeholder=" "
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="peer w-full bg-black/40 border-b-2 border-white/10 px-0 py-4 outline-none focus:border-orange-500 transition-all text-xl font-medium"
                />
                <label className="absolute left-0 top-4 text-gray-500 transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm">SHIPPING ADDRESS</label>
              </div>

              {/* Phone Input */}
              <div className="relative group/input">
                <div className="absolute right-0 top-4 text-orange-500/50 group-focus-within/input:text-orange-500 transition-colors">
                  <Phone size={20} />
                </div>
                <input
                  required
                  type="tel"
                  placeholder=" "
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="peer w-full bg-black/40 border-b-2 border-white/10 px-0 py-4 outline-none focus:border-orange-500 transition-all text-xl font-medium"
                />
                <label className="absolute left-0 top-4 text-gray-500 transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm uppercase tracking-wider">Contact Number</label>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="relative group/input">
                  <input
                    placeholder=" "
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="peer w-full bg-black/40 border-b-2 border-white/10 px-0 py-4 outline-none focus:border-orange-500 transition-all text-xl font-medium"
                  />
                  <label className="absolute left-0 top-4 text-gray-500 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4">CITY</label>
                </div>
                <div className="relative group/input">
                  <input
                    placeholder=" "
                    value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    className="peer w-full bg-black/40 border-b-2 border-white/10 px-0 py-4 outline-none focus:border-orange-500 transition-all text-xl font-medium"
                  />
                  <label className="absolute left-0 top-4 text-gray-500 transition-all peer-focus:-top-4 peer-focus:text-orange-500 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-4">ZIP CODE</label>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Method Selection */}
          <section className="backdrop-blur-2xl bg-white/[0.03] p-8 md:p-10 rounded-[2.5rem] border border-white/10 hover:border-orange-500/30 transition-all duration-500 shadow-2xl">
            <div className="flex items-center gap-4 text-orange-500 mb-10">
              <div className="p-3 bg-orange-500/10 rounded-2xl ring-1 ring-orange-500/50">
                <Wallet size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    paymentMethod === 'cod' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    <Banknote size={22} />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-wide">Cash on Delivery</p>
                    <p className="text-gray-500 text-xs mt-0.5">Pay when you receive</p>
                  </div>
                </div>
                {paymentMethod === 'cod' && <div className="absolute top-3 right-3 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>}
              </button>

              {/* JazzCash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  paymentMethod === 'jazzcash'
                    ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    paymentMethod === 'jazzcash' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-wide">JazzCash</p>
                    <p className="text-gray-500 text-xs mt-0.5">Mobile wallet</p>
                  </div>
                </div>
                {paymentMethod === 'jazzcash' && <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
              </button>

              {/* NayaPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nayapay')}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  paymentMethod === 'nayapay'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    paymentMethod === 'nayapay' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-wide">NayaPay</p>
                    <p className="text-gray-500 text-xs mt-0.5">Digital wallet</p>
                  </div>
                </div>
                {paymentMethod === 'nayapay' && <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>}
              </button>

              {/* EasyPaisa */}
              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  paymentMethod === 'easypaisa'
                    ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    paymentMethod === 'easypaisa' ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-wide">EasyPaisa</p>
                    <p className="text-gray-500 text-xs mt-0.5">Mobile payment</p>
                  </div>
                </div>
                {paymentMethod === 'easypaisa' && <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
              </button>
            </div>

            <p className="text-gray-600 text-xs mt-6 italic text-center uppercase tracking-wider">
              {paymentMethod === 'cod' ? '💵 Pay with cash when your order arrives' : `📱 Pay via ${paymentMethod === 'jazzcash' ? 'JazzCash' : paymentMethod === 'nayapay' ? 'NayaPay' : 'EasyPaisa'} on delivery`}
            </p>
          </section>
        </div>

        {/* Right: Order Summary (Bento Style) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32">
            <div className="backdrop-blur-3xl bg-white/[0.05] border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-[5rem]"></div>

              <h3 className="text-3xl font-black mb-10 italic tracking-tighter">THE HAUL</h3>

              <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex items-center gap-5 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border border-white/10 p-1 bg-black/40">
                        <img src={item.image} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-125" alt={item.name} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-lg leading-tight uppercase italic">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-orange-500 font-mono text-sm min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl italic">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500/40 hover:text-red-500 transition-all p-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center text-gray-400 group">
                  <span className="font-bold tracking-widest text-xs uppercase">Cargo Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="font-bold tracking-widest text-xs uppercase">Expedited Logistics</span>
                  <span className="font-mono text-white">$5.99</span>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="text-4xl font-black italic tracking-tighter">TOTAL</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-orange-500 italic drop-shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                      ${(subtotal + 5.99).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="group relative w-full mt-12 overflow-hidden rounded-2xl bg-white text-black py-6 transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <span className="font-black text-2xl italic tracking-tighter group-hover:text-white transition-colors">
                    {loading ? 'PROCESSING...' : (token ? 'CONFIRM ORDER' : 'AUTHORIZE ACCESS')}
                  </span>
                  {!loading && <ArrowRight size={24} className="group-hover:translate-x-2 group-hover:text-white transition-all" />}
                </div>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black italic">
              <ShieldCheck size={14} className="text-green-500" />
              Quantum Encrypted Transaction
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff6b00; }
      `}
      </style>
    </div>
  );
};

export default Checkout;