import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ShoppingBag, User, LogOut, LogIn, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] flex justify-between items-center transition-all duration-500 ${
        scrolled ? 'py-4 px-10 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'py-8 px-10 bg-transparent'
      }`}>

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex justify-center items-center transition-transform group-hover:rotate-12">
            <span className="font-black text-lg text-white">BF</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter">
            BURGER<span className="text-orange-500">FEVER</span>
          </h2>
        </Link>

        <ul className="hidden md:flex gap-12 font-bold uppercase tracking-widest text-[10px] italic">
          <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
          <li><Link to="/menu" className="hover:text-orange-500 transition-colors">The Menu</Link></li>
          <li><a href="#locations" className="hover:text-orange-500 transition-colors">Locations</a></li>
          <li><a href="#about" className="hover:text-orange-500 transition-colors">Our Story</a></li>
        </ul>

        <div className="flex items-center gap-6">


          <button 
            onClick={() => navigate('/checkout')}
            className="relative hover:text-orange-500 transition-colors cursor-pointer border-none bg-transparent mr-4"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/menu');
            }}
            className="hidden lg:block px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5"
          >
            Order Now
          </button>

          <button className="md:hidden text-white hover:text-orange-500 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#0a0a0a]/95 backdrop-blur-xl pt-32 px-10 flex flex-col items-center md:hidden"
          >
            <ul className="flex flex-col gap-8 text-center font-bold uppercase tracking-widest text-sm italic mb-12">
              <li><Link to="/" onClick={() => setMobileOpen(false)} className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/menu" onClick={() => setMobileOpen(false)} className="hover:text-orange-500 transition-colors">The Menu</Link></li>
              <li><a href="#locations" onClick={() => setMobileOpen(false)} className="hover:text-orange-500 transition-colors">Locations</a></li>
              <li><a href="#about" onClick={() => setMobileOpen(false)} className="hover:text-orange-500 transition-colors">Our Story</a></li>
            </ul>
            <button
              onClick={() => { 
                setMobileOpen(false); 
                window.scrollTo(0, 0);
                navigate('/menu'); 
              }}
              className="w-full max-w-xs py-4 bg-orange-500 text-white font-black uppercase tracking-[0.2em] rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
            >
              Order Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default Navbar;