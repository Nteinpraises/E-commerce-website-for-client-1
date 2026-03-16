import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', storeName: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-orange-500 text-white font-black text-2xl w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">MV</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join millions on MarketVault</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' }
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                required
                value={form[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
                placeholder={f.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'buyer', label: '🛍️ Buyer', desc: 'Shop products' },
                { value: 'vendor', label: '🏪 Vendor', desc: 'Sell products' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          {form.role === 'vendor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
                placeholder="My Awesome Store"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
