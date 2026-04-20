import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black pt-24 pb-12 px-[5%] border-t border-white/5 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex justify-center items-center">
                <span className="font-black text-lg text-white">BF</span>
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter">BURGER<span className="text-orange-500">FEVER</span></h2>
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm italic">
              Crafting premium wagyu experiences since 2024. Every bite is a calculated explosion of flavor and luxury.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all"><FaInstagram size={18} /></a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all"><FaTwitter size={18} /></a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all"><FaFacebook size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs italic">The Menu</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><Link to="/menu" className="hover:text-orange-500 transition-colors flex items-center gap-2">Signature Wagyu <ArrowUpRight size={14} /></Link></li>
              <li><Link to="/menu" className="hover:text-orange-500 transition-colors flex items-center gap-2">Truffle Series <ArrowUpRight size={14} /></Link></li>
              <li><Link to="/menu" className="hover:text-orange-500 transition-colors flex items-center gap-2">Golden Sides <ArrowUpRight size={14} /></Link></li>
              <li><Link to="/menu" className="hover:text-orange-500 transition-colors flex items-center gap-2">Artisan Shakes <ArrowUpRight size={14} /></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs italic">Experience</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Our Locations</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Private Dining</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Franchise</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs italic">Mailing List</h4>
            <p className="text-gray-500 text-sm mb-6 italic">Join the elite for secret menu drops.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="EMAIL@EXAMPLE.COM" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-xs font-bold outline-none focus:border-orange-500 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-orange-500 rounded-full text-[10px] font-black uppercase">Join</button>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold font-mono">
            &copy; 2026 BURGER FEVER INTELLECTUAL PROPERTY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold font-mono">
            <a href="#" className="hover:text-white transition-all">Privacy</a>
            <a href="#" className="hover:text-white transition-all">Terms</a>
            <a href="#" className="hover:text-white transition-all">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
