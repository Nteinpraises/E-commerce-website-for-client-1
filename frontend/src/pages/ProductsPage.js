import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('q') || '';

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ page, category, sort, minPrice, maxPrice, search, limit: 20 })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }).finally(() => setLoading(false));
  }, [page, category, sort, minPrice, maxPrice, search]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value; else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button onClick={() => updateParam('category', '')} className={`block text-sm w-full text-left py-1 hover:text-orange-500 ${!category ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}>All Categories</button>
          {categories.map(cat => (
            <button key={cat._id} onClick={() => updateParam('category', cat._id)} className={`block text-sm w-full text-left py-1 hover:text-orange-500 ${category === cat._id ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => updateParam('minPrice', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
          <span className="text-gray-400">-</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateParam('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
        {[4, 3, 2, 1].map(r => (
          <button key={r} onClick={() => updateParam('rating', r)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 py-1 w-full">
            {'★'.repeat(r)}{'☆'.repeat(5 - r)} <span>& up</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{search ? `Results for "${search}"` : 'All Products'}</h1>
          <p className="text-sm text-gray-500 mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-orange-500">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select value={sort} onChange={e => updateParam('sort', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => updateParam('page', i + 1)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
