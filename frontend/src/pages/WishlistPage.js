// WishlistPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage() {
  const { user } = useAuth();
  const wishlist = user?.wishlist || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Link to="/products" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(product => <ProductCard key={product._id || product} product={product} />)}
        </div>
      )}
    </div>
  );
}
