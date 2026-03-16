import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    getProducts({ search: q, limit: 20 })
      .then(res => { setProducts(res.data.products); setTotal(res.data.total); })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search size={22} className="text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Results for "{q}"</h1>
        </div>
        <p className="text-gray-500 text-sm">{total} products found</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 mb-6">Try different keywords or browse categories</p>
          <Link to="/products" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
