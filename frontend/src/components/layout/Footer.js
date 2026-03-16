import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 text-white font-black text-xl px-2 py-1 rounded">MV</div>
              <span className="font-bold text-white text-lg">MarketVault</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">The world's leading multi-vendor marketplace connecting buyers and sellers globally.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Careers', 'Press', 'Blog', 'Affiliates', 'Contact Us'].map(link => (
                <li key={link}><a href="#" className="hover:text-orange-400 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} className="text-orange-500 shrink-0" /> support@marketvault.com</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-orange-500 shrink-0" /> +237 123456789</li>
              <li className="flex items-start gap-2"><MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" /> 123 Commerce St, San Francisco, CA 94102</li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Subscribe to newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500" />
                <button className="bg-orange-500 text-white px-3 py-2 rounded text-xs hover:bg-orange-600 transition-colors">Go</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2024 MarketVault. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400">Terms of Service</a>
            <a href="#" className="hover:text-orange-400">Cookie Policy</a>
          </div>
          <div className="flex gap-2">
            {['visa', 'mastercard', 'paypal', 'stripe'].map(p => (
              <span key={p} className="bg-gray-800 px-2 py-1 rounded text-xs uppercase font-bold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
