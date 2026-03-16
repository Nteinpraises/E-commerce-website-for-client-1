import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Package, MapPin } from 'lucide-react';
import { getVendor, getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function VendorStorePage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVendor(id), getProducts({ vendor: id, limit: 20 })])
      .then(([v, p]) => {
        setVendor(v.data.vendor);
        setProducts(p.data.products);
      }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-48 bg-gray-200 rounded-2xl animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    </div>
  );

  if (!vendor) return <div className="text-center py-20">Vendor not found</div>;

  return (
    <div>
      {/* Store Banner */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 overflow-hidden">
          {vendor.banner && <img src={vendor.banner} alt="Store banner" className="w-full h-full object-cover" />}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 flex items-end gap-5 pb-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden shrink-0">
              {vendor.logo ? (
                <img src={vendor.logo} alt={vendor.storeName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-3xl">
                  {vendor.storeName?.[0]}
                </div>
              )}
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-black text-gray-900">{vendor.storeName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" /> {vendor.rating?.toFixed(1) || '0.0'} ({vendor.totalReviews || 0} reviews)
                </span>
                <span className="flex items-center gap-1"><Package size={14} /> {products.length} products</span>
                {vendor.address?.country && (
                  <span className="flex items-center gap-1"><MapPin size={14} /> {vendor.address.city}, {vendor.address.country}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vendor.description && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-8">
            <p className="text-gray-700 text-sm">{vendor.description}</p>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-6">All Products</h2>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
