import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { User, MapPin, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-center mb-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-2xl mx-auto mb-2">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            {[
              { id: 'profile', icon: User, label: 'Profile Info' },
              { id: 'addresses', icon: MapPin, label: 'Addresses' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-6">Profile Information</h2>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-lg capitalize">{user?.role}</span>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-6">Saved Addresses</h2>
              {user?.addresses?.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr, i) => (
                    <div key={i} className={`border-2 rounded-xl p-4 relative ${addr.isDefault ? 'border-orange-500' : 'border-gray-200'}`}>
                      {addr.isDefault && <span className="absolute top-3 right-3 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Default</span>}
                      <p className="font-semibold text-sm text-gray-900 mb-1">{addr.label || 'Address'}</p>
                      <p className="text-sm text-gray-600">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-sm text-gray-600">{addr.country}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No saved addresses yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive order updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Marketing Emails</p>
                    <p className="text-xs text-gray-500">Receive deals and promotions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <button className="text-sm text-red-500 hover:text-red-600 font-medium">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
