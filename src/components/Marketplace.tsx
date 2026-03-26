import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, MapPin, Package, User } from 'lucide-react';
import { motion } from 'motion/react';

const mockProducts = [
  { id: '1', name: 'Premium Wheat', category: 'Grains', price: 450, quantity: 50, unit: 'bags', location: 'Northern Farm', farmer: 'John Doe', image: 'https://picsum.photos/seed/wheat/400/300' },
  { id: '2', name: 'Organic Tomatoes', category: 'Vegetables', price: 120, quantity: 200, unit: 'kg', location: 'Central Valley', farmer: 'Jane Smith', image: 'https://picsum.photos/seed/tomato/400/300' },
  { id: '3', name: 'Hybrid Maize Seeds', category: 'Seeds', price: 850, quantity: 10, unit: 'packs', location: 'Western Hills', farmer: 'Robert Brown', image: 'https://picsum.photos/seed/maize/400/300' },
  { id: '4', name: 'Fresh Carrots', category: 'Vegetables', price: 80, quantity: 150, unit: 'kg', location: 'Southern Plains', farmer: 'Alice Green', image: 'https://picsum.photos/seed/carrot/400/300' },
];

export const Marketplace: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 p-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text"
            placeholder="Search produce, seeds, or farmers..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white flex items-center gap-2 hover:bg-white/10 transition-all">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product, i) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ${product.price} / {product.unit}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{product.name}</h3>
                <p className="text-white/40 text-sm">{product.category}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin size={16} className="text-emerald-400" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <User size={16} className="text-blue-400" />
                  <span>Farmer: {product.farmer}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Package size={16} className="text-amber-400" />
                  <span>Stock: {product.quantity} {product.unit}</span>
                </div>
              </div>

              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <ShoppingCart size={20} />
                <span>Buy Now</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
