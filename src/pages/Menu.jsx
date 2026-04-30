import React, { useEffect, useState, memo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = memo(({ product, index, onAddToCart }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500"
    style={{ willChange: 'opacity, transform' }}
  >
    <div className="aspect-[4/3] overflow-hidden bg-white/5">
      <img 
        src={product.image || '/images/default-food.jpg'} 
        alt={product.name}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.target.onerror = null; // prevents infinite loop if placeholder also breaks
          e.target.src = '/images/default-food.jpg';
        }}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ willChange: 'transform' }}
      />
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <span className="text-orange-500 font-mono text-xl">${product.price}</span>
      </div>
      <p className="text-gray-400 mb-8 line-clamp-2">{product.description}</p>
      <button 
        onClick={() => onAddToCart(product)}
        className="w-full py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300"
      >
        <Plus size={20} /> ADD TO CART
      </button>
    </div>
  </motion.div>
));

ProductCard.displayName = 'ProductCard';

const Menu = () => {
  const [products, setProducts] = useState(() => {
    const cached = sessionStorage.getItem('cachedProducts');
    return cached ? JSON.parse(cached) : [];
  });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        sessionStorage.setItem('cachedProducts', JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    
    // Fetch only if cache is empty to avoid redundant calls
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length]);

  return (
    <div className="pt-32 pb-20 px-[5%] max-w-[1400px] mx-auto min-h-screen relative z-[1]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h4 className="text-orange-500 uppercase tracking-widest mb-2 font-semibold">Exquisite Selection</h4>
        <h1 className="text-6xl font-black italic">OUR <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>SIGNATURES</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.isArray(products) && products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
            onAddToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
