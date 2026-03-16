import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShoppingBag, Store,
  Tag, LogOut, Menu, X, TrendingUp, DollarSign,
  Search, Trash2, Edit, Check, Ban, ChevronDown,
  ArrowUpRight, RefreshCw, AlertCircle, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

// ── API helpers ──────────────────────────────────────────────
const adminAPI = {
  getStats:      () => API.get('/admin/stats'),
  getUsers:      (p) => API.get('/admin/users', { params: p }),
  updateUser:    (id, d) => API.put(`/admin/users/${id}`, d),
  deleteUser:    (id) => API.delete(`/admin/users/${id}`),
  getProducts:   (p) => API.get('/admin/products', { params: p }),
  updateProduct: (id, d) => API.put(`/admin/products/${id}`, d),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),
  getOrders:     (p) => API.get('/admin/orders', { params: p }),
  updateOrder:   (id, d) => API.put(`/admin/orders/${id}`, d),
  getVendors:    () => API.get('/admin/vendors'),
  updateVendor:  (id, d) => API.put(`/admin/vendors/${id}`, d),
  getCategories: () => API.get('/admin/categories'),
  createCategory:(d) => API.post('/admin/categories', d),
  updateCategory:(id, d) => API.put(`/admin/categories/${id}`, d),
  deleteCategory:(id) => API.delete(`/admin/categories/${id}`),
};

// ── Stat Card ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-orange-500/50 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <ArrowUpRight size={16} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
    </div>
    <p className="text-2xl font-black text-white mb-1">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
    {sub && <p className="text-xs text-green-400 mt-1">{sub}</p>}
  </div>
);

// ── Badge ────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    active:    'bg-green-500/20 text-green-400',
    approved:  'bg-green-500/20 text-green-400',
    paid:      'bg-green-500/20 text-green-400',
    delivered: 'bg-green-500/20 text-green-400',
    pending:   'bg-yellow-500/20 text-yellow-400',
    processing:'bg-blue-500/20 text-blue-400',
    shipped:   'bg-indigo-500/20 text-indigo-400',
    suspended: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-red-500/20 text-red-400',
    failed:    'bg-red-500/20 text-red-400',
    inactive:  'bg-gray-500/20 text-gray-400',
    buyer:     'bg-blue-500/20 text-blue-400',
    vendor:    'bg-purple-500/20 text-purple-400',
    admin:     'bg-orange-500/20 text-orange-400',
  };
  const cls = map[status] || 'bg-gray-500/20 text-gray-400';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {status}
    </span>
  );
};

// ── Search Bar ───────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
      className="bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 w-64 transition-colors"
    />
  </div>
);

// ── Table wrapper ────────────────────────────────────────────
const Table = ({ headers, children, empty }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700">
          {headers.map(h => (
            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {children}
      </tbody>
    </table>
    {empty && (
      <div className="text-center py-16">
        <AlertCircle size={40} className="mx-auto text-gray-600 mb-3" />
        <p className="text-gray-500">{empty}</p>
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════
// SECTIONS
// ══════════════════════════════════════════════════════════════

// ── Dashboard ────────────────────────────────────────────────
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-gray-800 rounded-2xl animate-pulse" />)}
    </div>
  );

  const { stats, recentOrders, topProducts } = data || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back, Admin 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(stats?.totalRevenue||0).toFixed(2)}`} sub="From paid orders" color="bg-green-500/20 text-green-400" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders||0} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Package} label="Products" value={stats?.totalProducts||0} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={Users} label="Users" value={stats?.totalUsers||0} color="bg-orange-500/20 text-orange-400" />
        <StatCard icon={Store} label="Vendors" value={stats?.totalVendors||0} color="bg-pink-500/20 text-pink-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="font-bold text-white mb-4">Recent Orders</h3>
          {recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{o.orderNumber}</p>
                    <p className="text-xs text-gray-500">{o.buyer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">${o.total?.toFixed(2)}</p>
                    <Badge status={o.overallStatus} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>}
        </div>

        {/* Top Products */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="font-bold text-white mb-4">Top Selling Products</h3>
          {topProducts?.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                  <span className="text-lg font-black text-gray-600 w-6">#{i+1}</span>
                  <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.totalSales} sold</p>
                  </div>
                  <p className="text-sm font-bold text-orange-400">${p.price?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm text-center py-8">No products yet</p>}
        </div>
      </div>
    </div>
  );
}

// ── Users ────────────────────────────────────────────────────
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers({ search, limit: 50 })
      .then(r => setUsers(r.data.users))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (user) => {
    try {
      await adminAPI.updateUser(user._id, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
      toast.success(`User ${user.isActive ? 'suspended' : 'activated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="text-gray-500 text-sm">{users.length} total users</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={['User', 'Role', 'Status', 'Joined', 'Actions']} empty={users.length === 0 ? 'No users found' : null}>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge status={user.role} /></td>
                <td className="px-4 py-3"><Badge status={user.isActive ? 'active' : 'inactive'} /></td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(user)} title={user.isActive ? 'Suspend' : 'Activate'} className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}>
                      {user.isActive ? <Ban size={15} /> : <Check size={15} />}
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}

// ── Products ─────────────────────────────────────────────────
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getProducts({ search, limit: 50 })
      .then(r => setProducts(r.data.products))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (product) => {
    try {
      await adminAPI.updateProduct(product._id, { isActive: !product.isActive });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`);
    } catch { toast.error('Failed to update'); }
  };

  const toggleFeatured = async (product) => {
    try {
      await adminAPI.updateProduct(product._id, { isFeatured: !product.isFeatured });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p));
      toast.success(`Product ${product.isFeatured ? 'removed from' : 'added to'} featured`);
    } catch { toast.error('Failed to update'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Products</h2>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={['Product', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions']} empty={products.length === 0 ? 'No products found' : null}>
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate max-w-48">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.vendor?.storeName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">{product.category?.name}</td>
                <td className="px-4 py-3 font-bold text-orange-400">${product.price?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>{product.stock}</span>
                </td>
                <td className="px-4 py-3"><Badge status={product.isActive ? 'active' : 'inactive'} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleFeatured(product)} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${product.isFeatured ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-500 hover:text-orange-400'}`}>
                    {product.isFeatured ? '⭐ Featured' : 'Set Featured'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(product)} className={`p-1.5 rounded-lg transition-colors ${product.isActive ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}>
                      {product.isActive ? <Ban size={15} /> : <Check size={15} />}
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}

// ── Orders ───────────────────────────────────────────────────
function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getOrders({ status: filter, limit: 50 })
      .then(r => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateOrder(id, { overallStatus: status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, overallStatus: status } : o));
      toast.success('Order updated');
    } catch { toast.error('Failed to update'); }
  };

  const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="text-gray-500 text-sm">{orders.length} orders</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={['Order #', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Update']} empty={orders.length === 0 ? 'No orders found' : null}>
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 font-semibold text-white text-sm">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-white">{order.buyer?.name}</p>
                  <p className="text-xs text-gray-500">{order.buyer?.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-bold text-orange-400">${order.total?.toFixed(2)}</td>
                <td className="px-4 py-3"><Badge status={order.paymentStatus} /></td>
                <td className="px-4 py-3"><Badge status={order.overallStatus} /></td>
                <td className="px-4 py-3">
                  <select
                    value={order.overallStatus}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1 text-xs outline-none focus:border-orange-500"
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}

// ── Vendors ──────────────────────────────────────────────────
function VendorsSection() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getVendors()
      .then(r => setVendors(r.data.vendors))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateVendor(id, { status });
      setVendors(prev => prev.map(v => v._id === id ? { ...v, status } : v));
      toast.success(`Vendor ${status}`);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Vendors</h2>
        <p className="text-gray-500 text-sm">{vendors.length} total vendors</p>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={['Store', 'Owner', 'Rating', 'Sales', 'Status', 'Actions']} empty={vendors.length === 0 ? 'No vendors yet' : null}>
            {vendors.map(vendor => (
              <tr key={vendor._id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold shrink-0">
                      {vendor.storeName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{vendor.storeName}</p>
                      <p className="text-xs text-gray-500">{vendor.storeSlug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-white">{vendor.user?.name}</p>
                  <p className="text-xs text-gray-500">{vendor.user?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-yellow-400 text-sm font-bold">★ {vendor.rating?.toFixed(1) || '0.0'}</span>
                  <p className="text-xs text-gray-500">{vendor.totalReviews} reviews</p>
                </td>
                <td className="px-4 py-3 text-white text-sm font-semibold">{vendor.totalSales || 0}</td>
                <td className="px-4 py-3"><Badge status={vendor.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {vendor.status !== 'approved' && (
                      <button onClick={() => updateStatus(vendor._id, 'approved')} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors">
                        Approve
                      </button>
                    )}
                    {vendor.status !== 'suspended' && (
                      <button onClick={() => updateStatus(vendor._id, 'suspended')} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors">
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}

// ── Categories ───────────────────────────────────────────────
function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '' });
  const [adding, setAdding] = useState(false);

  const load = () => {
    adminAPI.getCategories()
      .then(r => setCategories(r.data.categories))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const slug = newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, '-');
      await adminAPI.createCategory({ ...newCat, slug, isActive: true });
      toast.success('Category created!');
      setNewCat({ name: '', slug: '', icon: '' });
      setAdding(false);
      load();
    } catch { toast.error('Failed to create category'); }
  };

  const toggleActive = async (cat) => {
    try {
      await adminAPI.updateCategory(cat._id, { isActive: !cat.isActive });
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: !c.isActive } : c));
      toast.success('Category updated');
    } catch { toast.error('Failed to update'); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminAPI.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Categories</h2>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-colors text-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {adding && (
        <form onSubmit={addCategory} className="bg-gray-800 rounded-2xl p-5 border border-orange-500/30 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name *</label>
            <input required value={newCat.name} onChange={e => setNewCat(n => ({ ...n, name: e.target.value }))} className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="e.g. Accessories" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Icon (emoji)</label>
            <input value={newCat.icon} onChange={e => setNewCat(n => ({ ...n, icon: e.target.value }))} className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 w-20" placeholder="👔" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Slug (auto)</label>
            <input value={newCat.slug} onChange={e => setNewCat(n => ({ ...n, slug: e.target.value }))} className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="auto-generated" />
          </div>
          <button type="submit" className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm">Save</button>
          <button type="button" onClick={() => setAdding(false)} className="text-gray-400 hover:text-white text-sm px-3 py-2">Cancel</button>
        </form>
      )}

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={['Icon', 'Name', 'Slug', 'Status', 'Actions']} empty={categories.length === 0 ? 'No categories yet' : null}>
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                <td className="px-4 py-3 font-semibold text-white">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 text-sm font-mono">{cat.slug}</td>
                <td className="px-4 py-3"><Badge status={cat.isActive ? 'active' : 'inactive'} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(cat)} className={`p-1.5 rounded-lg transition-colors ${cat.isActive ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}>
                      {cat.isActive ? <Ban size={15} /> : <Check size={15} />}
                    </button>
                    <button onClick={() => deleteCategory(cat._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ══════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders',    icon: ShoppingBag,     label: 'Orders' },
  { id: 'products',  icon: Package,         label: 'Products' },
  { id: 'users',     icon: Users,           label: 'Users' },
  { id: 'vendors',   icon: Store,           label: 'Vendors' },
  { id: 'categories',icon: Tag,             label: 'Categories' },
];

export default function AdminPanelPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  const renderSection = () => {
    switch(active) {
      case 'dashboard':  return <Dashboard />;
      case 'users':      return <UsersSection />;
      case 'products':   return <ProductsSection />;
      case 'orders':     return <OrdersSection />;
      case 'vendors':    return <VendorsSection />;
      case 'categories': return <CategoriesSection />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg">M</div>
            <div>
              <p className="font-black text-white text-sm">MarketVault</p>
              <p className="text-xs text-orange-500 font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active === item.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-white font-bold capitalize">{active}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <RefreshCw size={18} />
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="text-xs text-orange-400 hover:text-orange-300 font-semibold border border-orange-500/30 px-3 py-1.5 rounded-lg hover:bg-orange-500/10 transition-colors">
              View Store ↗
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
