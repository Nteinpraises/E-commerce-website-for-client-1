import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCartStore } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const mainImage = product.images?.find(i => i.isMain)?.url || product.images?.[0]?.url || 'https://via.placeholder.com/300';
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/products/${product._id}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.freeShipping && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Free Ship
          </span>
        )}
        {/* Quick actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors shadow-lg"
              title="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
            <button className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg" title="Add to wishlist">
              <Heart size={18} />
            </button>
            <Link to={`/products/${product._id}`} className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg" title="Quick view">
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {product.vendor && (
          <p className="text-xs text-orange-500 font-medium mb-1 truncate">{product.vendor.storeName}</p>
        )}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 flex-1">{product.name}</h3>

        {/* Rating */}
        {product.totalReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} className={s <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.totalReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">${product.comparePrice?.toFixed(2)}</span>
          )}
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-red-500 mt-1">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-gray-400 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
