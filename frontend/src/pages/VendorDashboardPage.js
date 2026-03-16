import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Star, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { getProducts, getVendorOrders, deleteProduct } from '../services/api';
import toast from 'react-hot-toast';

export default function VendorDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 50 }),
      getVendorOrders(),
    ]).then(([p, o]) => {
      setProducts(p.data.products || []);
      setOrders(o.data.orders || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalSales = orders.reduce((sum, o) => sum + o.items?.length || 0, 0);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const STATS = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Products Listed', value: products.length, icon: Package, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const TABS = ['overview', 'products', 'orders'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store and products</p>
        </div>
        <Link
          to="/vendor/products/new"
          className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
            {orders.slice(0, 5).map(order => (
              <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                  <span className="text-xs text-orange-500 font-medium capitalize">{order.overallStatus}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Top Products</h2>
            {products.slice(0, 5).map(product => (
              <div key={product._id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.totalSales || 0} sold</p>
                </div>
                <p className="text-sm font-bold text-gray-900">${product.price?.toFixed(2)}</p>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No products yet</p>}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">All Products ({products.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">No products yet</p>
              <Link to="/vendor/products/new" className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition-colors text-sm">
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Product', 'Price', 'Stock', 'Sales', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images?.[0]?.url || 'https://via.placeholder.com/48'} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">${product.price?.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{product.stock}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{product.totalSales || 0}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/vendor/products/${product._id}/edit`} className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">All Orders ({orders.length})</h2>
          </div>
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Order #', 'Customer', 'Date', 'Total', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-gray-900">{order.orderNumber}</td>
                      <td className="px-5 py-4 text-gray-600">{order.buyer?.name || 'N/A'}</td>
                      <td className="px-5 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4 font-bold text-gray-900">${order.total?.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 capitalize">
                          {order.overallStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/orders/${order._id}`} className="text-orange-500 hover:text-orange-600 font-semibold text-xs">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
