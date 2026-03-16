import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RefreshCw, Headphones, TrendingUp, Zap } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/product/ProductCard';

const HERO_CATEGORIES = [
  { name: 'Suits & Blazers', icon: '🤵', color: 'bg-gray-100 text-gray-700' },
  { name: 'Shirts', icon: '👔', color: 'bg-blue-100 text-blue-700' },
  { name: 'T-Shirts', icon: '👕', color: 'bg-orange-100 text-orange-700' },
  { name: 'Jeans & Trousers', icon: '👖', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Shoes', icon: '👟', color: 'bg-green-100 text-green-700' },
  { name: 'Socks & Underwear', icon: '🧦', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Jackets & Coats', icon: '🧥', color: 'bg-purple-100 text-purple-700' },
  { name: "Women's Fashion", icon: '👗', color: 'bg-pink-100 text-pink-700' },
];

const FEATURES = [
  { icon: Shield, title: 'Buyer Protection', desc: 'Safe and secure payments' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true, limit: 8 }),
      getProducts({ sort: 'newest', limit: 8 }),
    ]).then(([featured, newest]) => {
      setFeaturedProducts(featured.data.products);
      setNewArrivals(newest.data.products);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap size={16} /> 10M+ Products from verified vendors
              </div>
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-6">
                Shop Everything.<br />
                <span className="text-yellow-300">Sell Anything.</span>
              </h1>
              <p className="text-orange-100 text-lg mb-8 max-w-md">
                Join millions of buyers and thousands of vendors on the world's fastest-growing multi-vendor marketplace.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2">
                  Start Shopping <ArrowRight size={20} />
                </Link>
                
              </div>
              <div className="flex gap-8 mt-10">
                {[['10M+', 'Products'], ['500K+', 'Vendors'], ['50M+', 'Buyers']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-yellow-300">{num}</p>
                    <p className="text-orange-200 text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { bg: 'bg-white/20', emoji: '📱', label: 'Electronics', price: 'from $9.99' },
                { bg: 'bg-white/10', emoji: '👗', label: 'Fashion', price: 'from $4.99' },
                { bg: 'bg-white/10', emoji: '🏡', label: 'Home & Garden', price: 'from $12.99' },
                { bg: 'bg-white/20', emoji: '💄', label: 'Beauty', price: 'from $2.99' },
              ].map((card, i) => (
                <div key={i} className={`${card.bg} backdrop-blur rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-white/20 hover:bg-white/30 transition-all cursor-pointer`}>
                  <span className="text-4xl">{card.emoji}</span>
                  <p className="font-bold text-white">{card.label}</p>
                  <p className="text-orange-200 text-sm">{card.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {HERO_CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name}`} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-md transition-all group">
              <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs text-gray-600 font-medium text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-orange-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🔥 Featured Products</h2>
          <Link to="/products?featured=true" className="text-orange-500 font-semibold text-sm flex items-center gap-1 hover:text-orange-600">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-orange-400 font-semibold mb-2">Limited Time Offer</p>
            <h3 className="text-3xl font-black text-white mb-2">Get 20% OFF your first order</h3>
            <p className="text-gray-400">Use code <span className="text-orange-400 font-bold">WELCOME20</span> at checkout</p>
          </div>
          <Link to="/products" className="bg-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap flex items-center gap-2">
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✨ New Arrivals</h2>
          <Link to="/products?sort=newest" className="text-orange-500 font-semibold text-sm flex items-center gap-1 hover:text-orange-600">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
