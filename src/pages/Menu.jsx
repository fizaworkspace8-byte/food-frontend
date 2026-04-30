import React, { useEffect, useState, memo, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Memoized Product Card to prevent unnecessary re-renders during scroll
const ProductCard = memo(({ product, index, onAddToCart }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: (index % 3) * 0.1 }}
    className="group relative bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500"
  >
    <div className="aspect-[4/3] overflow-hidden bg-white/5">
      <img
        src={
          product.name === 'Gold Leaf Fries' ? '/images/gold-leaf-fries.png' :
          product.name === 'Smash Classic' ? '/images/smash-classic.png' :
          (product.image || '/images/default-food.jpg')
        }
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Check session storage first
      const cached = sessionStorage.getItem('cachedProducts');
      if (cached) {
        setProducts(JSON.parse(cached));
        setLoading(false);
      }

      // Always fetch fresh data in the background
      const res = await axios.get('https://food-backend-bmwx.onrender.com/api/products');
      const data = Array.isArray(res.data) ? res.data : [];

      setProducts(data);
      sessionStorage.setItem('cachedProducts', JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="relative z-[10] pt-32 pb-20 px-[5%] max-w-[1400px] mx-auto min-h-screen bg-[#050505]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h4 className="text-orange-500 uppercase tracking-widest mb-2 font-semibold">Exquisite Selection</h4>
        <h1 className="text-6xl font-black italic text-white">
          OUR <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>SIGNATURES</span>
        </h1>
      </motion.div>

      {loading && products.length === 0 ? (
        // Skeleton Grid while loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[450px] bg-white/5 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || product.id || index}
              product={product}
              index={index}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No delicacies found. Check your backend connection.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;