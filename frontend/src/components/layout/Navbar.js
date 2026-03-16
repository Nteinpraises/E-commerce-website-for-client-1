import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, Menu, X, Store, ChevronDown, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const cartCount = useCartStore(s => s.count);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-orange-500 text-white text-xs text-center py-1.5 px-4">
        Free shipping on orders over $100 | New vendors welcome!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-orange-500 text-white font-black text-xl px-2 py-1 rounded">MV</div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">MarketVault</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
            <div className="flex w-full border-2 border-orange-500 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search products, brands, vendors..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-orange-500 text-white px-5 hover:bg-orange-600 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:flex items-center gap-1 p-2 hover:text-orange-500 transition-colors text-gray-600">
              <Heart size={22} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-1 p-2 hover:text-orange-500 transition-colors text-gray-600">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:text-orange-500 transition-colors text-gray-600"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <ChevronDown size={16} className="hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                      <Package size={16} /> My Orders
                    </Link>
                    {(user.role === 'vendor' || user.role === 'admin') && (
                      <Link to="/vendor/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                        <Store size={16} /> Vendor Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-6 py-2 text-sm font-medium text-gray-600 border-t border-gray-100">
          {['Suits & Blazers', 'Shirts', 'T-Shirts', 'Jeans & Trousers', 'Shoes', 'Socks & Underwear', 'Jackets & Coats', "Women's Fashion"].map(cat => (
            <Link key={cat} to={`/products?category=${cat.toLowerCase()}`} className="hover:text-orange-500 transition-colors whitespace-nowrap">
              {cat}
            </Link>
          ))}
          
        </nav>
      </div>

      {/* Mobile search */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}
