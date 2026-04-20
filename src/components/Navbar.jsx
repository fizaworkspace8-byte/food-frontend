import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
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

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 border-r border-white/10 pr-4">
              <span className="text-xs font-bold uppercase italic text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <Link to="/orders" className="hover:text-orange-500 transition-colors" title="My Orders"><ClipboardList size={18} /></Link>
              <button onClick={logout} className="hover:text-orange-500 transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-orange-500 transition-colors"><User size={20} /></Link>
          )}
          <Link to="/checkout" className="relative hover:text-orange-500 transition-colors group">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <button onClick={() => navigate('/menu')} className="hidden lg:block px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5">
          Order Now
        </button>
        <button className="md:hidden"><Menu size={24} /></button>
      </div>
    </nav>
  );
};

export default Navbar;
