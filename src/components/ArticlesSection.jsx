import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    title: "The Ultimate Smashburger Recipe",
    category: "Masterclass",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2799&auto=format&fit=crop",
    time: "5 min read",
    date: "Oct 12, 2024"
  },
  {
    id: 2,
    title: "Top 10 Hidden Fast Food Spots in NYC",
    category: "Reviews",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2865&auto=format&fit=crop",
    time: "8 min read",
    date: "Oct 10, 2024"
  },
  {
    id: 3,
    title: "Why Double Patties Are the Future",
    category: "Culture",
    // FIXED: Updated image URL to a working asset
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2864&auto=format&fit=crop",
    time: "4 min read",
    date: "Oct 08, 2024"
  }
];

const ArticlesSection = () => {
  return (
    <section
      id="articles"
      className="py-32 px-[5%] bg-black relative z-10 border-t border-white/5"
      // PERFORMANCE: Tells browser to skip rendering this until it's near the viewport
      style={{ contentVisibility: 'auto', containmentIntrinsicSize: '0 1000px' }}
    >
      <div className="max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h4 className="text-orange-500 uppercase tracking-[4px] mb-4 font-black italic text-xs">The Journal</h4>
            <h2 className="text-6xl font-black italic tracking-tighter text-white">
              LATEST <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff' }}>INSIGHTS</span>
            </h2>
          </motion.div>

          <button className="flex items-center gap-4 bg-transparent border border-white/10 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-black hover:-translate-y-2 group">
            Browse All <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1] // Optimization: Use cubic-bezier for smoother GPU transitions
              }}
              className="bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-orange-500/20 transition-all group cursor-pointer"
              // Force GPU layer to prevent Hero animation from stuttering
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            >
              <div className="w-full h-[300px] overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy" // PERFORMANCE: Don't load Journal images until the burger is done
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-8 left-8 bg-orange-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic text-white shadow-xl">
                  {article.category}
                </div>
              </div>

              <div className="p-10">
                <div className="flex gap-6 text-gray-500 text-[10px] font-black uppercase tracking-widest italic mb-6 items-center">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-orange-500" />
                    {article.time}
                  </span>
                </div>
                <h3 className="text-3xl font-black italic leading-none tracking-tighter mb-8 group-hover:text-orange-500 transition-colors uppercase text-white">
                  {article.title}
                </h3>
                <span className="text-white font-black italic flex items-center gap-2 text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Journal <ArrowRight size={18} className="text-orange-500" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ArticlesSection);