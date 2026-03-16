import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="bg-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center gap-2">
        Start Shopping <ArrowRight size={20} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({count} items)</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear All</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.key} className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 shadow-sm">
              <Link to={`/products/${item.productId}`}>
                <img
                  src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-orange-500 line-clamp-2 text-sm">
                  {item.product.name}
                </Link>
                {item.variant && <p className="text-xs text-gray-500 mt-1">{item.variant.name}: {item.variant.value}</p>}
                <p className="text-orange-500 font-bold mt-2">${item.product.price?.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <button onClick={() => removeItem(item.key)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-1 font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-bold text-gray-900 text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({count} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {total < 100 && (
                <p className="text-xs text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
                  Add ${(100 - total).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Coupon code" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">Apply</button>
            </div>

            <button
              onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'} <ArrowRight size={20} />
            </button>
            <Link to="/products" className="block text-center text-sm text-orange-500 font-medium mt-4 hover:text-orange-600">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
