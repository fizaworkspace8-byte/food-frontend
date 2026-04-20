import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle2, Truck, MapPin, ShoppingBag, Wallet } from 'lucide-react';

const API = 'http://localhost:5000/api';

const statusConfig = {
  pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: CheckCircle2, label: 'Confirmed' },
  preparing: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Package, label: 'Preparing' },
  out_for_delivery: { color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Truck, label: 'Out for Delivery' },
  delivered: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: CheckCircle2, label: 'Delivered' },
  cancelled: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: Clock, label: 'Cancelled' },
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const toggleExpand = (orderNumber) => {
    setExpandedOrder(expandedOrder === orderNumber ? null : orderNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold italic">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem]"
        >
          <div className="text-8xl mb-6">📋</div>
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">NO ORDERS <span className="text-orange-500">YET</span></h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-sm">Your order history will appear here</p>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-400 transition-all transform hover:scale-110"
          >
            START ORDERING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 pt-32 pb-20 px-[5%] max-w-[1000px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-7xl font-black italic mb-2 tracking-tighter leading-none">
            ORDER <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">HISTORY</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-12 bg-orange-500"></span>
            <p className="text-gray-500 uppercase tracking-[0.4em] text-xs font-bold">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total</p>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.confirmed;
              const StatusIcon = status.icon;
              const isExpanded = expandedOrder === order.order_number;

              return (
                <motion.div
                  key={order.order_number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`backdrop-blur-2xl bg-white/[0.03] rounded-[2rem] border ${isExpanded ? 'border-orange-500/30' : 'border-white/10'} overflow-hidden transition-all duration-500 hover:border-orange-500/20`}
                >
                  {/* Order Header (Clickable) */}
                  <button
                    onClick={() => toggleExpand(order.order_number)}
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-3 rounded-2xl ${status.bg} ring-1 ${status.border}`}>
                        <StatusIcon size={24} className={status.color} />
                      </div>
                      <div>
                        <p className="font-black text-xl italic tracking-tight">{order.order_number}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                          })}
                          <span className="mx-2">•</span>
                          {new Date(order.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className={`text-xs font-black uppercase tracking-wider ${status.color}`}>{status.label}</p>
                        <p className="text-2xl font-black text-orange-500 italic">${parseFloat(order.total).toFixed(2)}</p>
                      </div>
                      {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8 pt-2 border-t border-white/5">
                          {/* Mobile total & status */}
                          <div className="sm:hidden mb-6 flex justify-between items-center">
                            <span className={`text-xs font-black uppercase ${status.color} px-3 py-1 rounded-full ${status.bg}`}>{status.label}</span>
                            <span className="text-2xl font-black text-orange-500 italic">${parseFloat(order.total).toFixed(2)}</span>
                          </div>

                          {/* Items */}
                          <div className="space-y-4 mb-6">
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Items Ordered</p>
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
                                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                  <p className="font-bold text-sm uppercase">{item.product_name}</p>
                                  <p className="text-gray-500 text-xs font-mono">x{item.quantity} @ ${parseFloat(item.product_price).toFixed(2)}</p>
                                </div>
                                <p className="font-black text-sm italic">${parseFloat(item.line_total).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                                <MapPin size={12} /> Shipping
                              </div>
                              <p className="text-sm">{order.shipping_address || 'N/A'}</p>
                              <p className="text-sm text-gray-400">{order.shipping_city}{order.shipping_zip ? `, ${order.shipping_zip}` : ''}</p>
                              {order.shipping_phone && <p className="text-sm text-gray-400 mt-1">📞 {order.shipping_phone}</p>}
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                                <ShoppingBag size={12} /> Summary
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Subtotal</span>
                                  <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Shipping</span>
                                  <span>${parseFloat(order.shipping_fee).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/10 pt-1 mt-1 font-black">
                                  <span className="text-orange-500">${parseFloat(order.total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/10 pt-1 mt-1 text-xs">
                                  <span className="text-gray-400">Payment</span>
                                  <span className="uppercase text-white/80">{
                                    order.payment_method === 'cod' ? 'Cash on Delivery' :
                                    order.payment_method === 'jazzcash' ? 'JazzCash' :
                                    order.payment_method === 'nayapay' ? 'NayaPay' :
                                    order.payment_method === 'easypaisa' ? 'EasyPaisa' : 'Card'
                                  }</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
