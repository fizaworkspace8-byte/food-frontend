import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Mail, MapPin, ArrowRight } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || 'ORD-UNKNOWN';

  return (
    <div className="min-h-screen pt-32 pb-20 px-[5%] max-w-[1400px] mx-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#111] p-16 rounded-[3rem] border border-white/5 text-center relative overflow-hidden"
      >
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
          className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(249,115,22,0.4)]"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>

        <h1 className="text-5xl font-black italic mb-4 tracking-tight">ORDER CONFIRMED</h1>
        <p className="text-gray-400 uppercase tracking-[0.4em] text-sm mb-12">Tracking ID: {orderId}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
          <div className="bg-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
              <Package size={16} /> Status
            </div>
            <p className="text-white font-bold italic">PREPARING IN KITCHEN</p>
            <p className="text-gray-500 text-xs italic">Est. Delivery: 35-45 mins</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
              <Mail size={16} /> Notification
            </div>
            <p className="text-white font-bold italic">CONFIRMATION SENT</p>
            <p className="text-gray-500 text-xs italic">Check your inbox for receipt</p>
          </div>
        </div>

        {/* Separate explicitly requested success statement */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <p className="text-green-400 font-bold uppercase tracking-wider text-sm">
            Success: Order is confirmed via email
          </p>
        </motion.div>

        <button 
          onClick={() => navigate('/menu')}
          className="flex items-center gap-3 mx-auto text-orange-500 font-black italic hover:gap-5 transition-all group"
        >
          BACK TO THE SHOP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest font-bold italic"
      >
        <MapPin size={14} className="text-orange-500" /> 
        Track real-time at burger-fever.com/track/{orderId}
      </motion.div>
    </div>
  );
};

export default Confirmation;
