import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, ChevronRight, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { getMyOrders, getOrder } from '../services/api';

const STATUS_CONFIG = {
  pending:    { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed:  { color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  processing: { color: 'bg-purple-100 text-purple-700', icon: Package },
  shipped:    { color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  delivered:  { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled:  { color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(res => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.overallStatus] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            return (
              <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <StatusIcon size={12} /> {order.overallStatus.charAt(0).toUpperCase() + order.overallStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {order.items?.slice(0, 4).map((item, i) => (
                        <img key={i} src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      ))}
                      {order.items?.length > 4 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900 text-lg">${order.total?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 capitalize">{order.paymentMethod} · {order.paymentStatus}</p>
                    <ChevronRight size={20} className="ml-auto mt-2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(res => setOrder(res.data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12"><div className="h-96 bg-gray-100 rounded-xl animate-pulse" /></div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = STEPS.indexOf(order.overallStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/orders" className="text-orange-500 hover:text-orange-600 font-medium text-sm">← My Orders</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold text-sm">{order.orderNumber}</span>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-6">Order Status</h2>
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium capitalize hidden sm:block ${i <= currentStep ? 'text-orange-500' : 'text-gray-400'}`}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded transition-all ${i < currentStep ? 'bg-orange-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Items ({order.items?.length})</h2>
        <div className="space-y-4">
          {order.items?.map((item, i) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            return (
              <div key={i} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  {item.variant && <p className="text-xs text-gray-500">{item.variant.name}: {item.variant.value}</p>}
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                  {item.trackingNumber && <p className="text-xs text-blue-600 mt-1">Tracking: {item.trackingNumber}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${item.subtotal?.toFixed(2)}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${cfg.color}`}>
                    <StatusIcon size={10} /> {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">Shipping Address</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p>{order.shippingAddress?.country}</p>
            <p className="text-gray-500">{order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${order.shippingCost?.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>${order.tax?.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
              <span>Total</span><span>${order.total?.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              Paid via <span className="font-semibold capitalize">{order.paymentMethod}</span> ·{' '}
              <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
