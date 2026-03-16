import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '../context/CartContext';
import { createPaymentIntent } from '../services/api';
import { Shield, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
    invalid: { color: '#9e2146' },
  },
};

function CheckoutForm({ items, address }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const clearCart = useCartStore(s => s.clearCart);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // Create payment intent on backend
      const { data } = await createPaymentIntent({ items, shippingAddress: address });

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: address.name },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${data.orderId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-gray-200 rounded-xl p-4 focus-within:border-orange-500 transition-colors">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreditCard size={20} />
        {processing ? 'Processing...' : `Pay Now`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', country: '', zipCode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  if (items.length === 0) { navigate('/cart'); return null; }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Confirm' }].map(s => (
          <React.Fragment key={s.n}>
            <div className={`flex items-center gap-2 ${step >= s.n ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.n ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{s.n}</div>
              <span className="font-medium text-sm hidden sm:block">{s.label}</span>
            </div>
            {s.n < 3 && <div className={`flex-1 h-px ${step > s.n ? 'bg-orange-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Truck size={20} className="text-orange-500" /> Shipping Address
              </h2>
              <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', cols: 2 },
                  { key: 'street', label: 'Street Address', cols: 2 },
                  { key: 'city', label: 'City', cols: 1 },
                  { key: 'state', label: 'State/Province', cols: 1 },
                  { key: 'country', label: 'Country', cols: 1 },
                  { key: 'zipCode', label: 'ZIP / Postal Code', cols: 1 },
                  { key: 'phone', label: 'Phone Number', cols: 2 },
                ].map(field => (
                  <div key={field.key} className={field.cols === 2 ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="text"
                      required
                      value={address[field.key]}
                      onChange={e => setAddress(a => ({ ...a, [field.key]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <button type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors">
                    Continue to Payment →
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-500" /> Payment Method
              </h2>

              {/* Payment method selector */}
              <div className="flex gap-3 mb-6">
                {[
                  { id: 'stripe', label: '💳 Credit/Debit Card' },
                  { id: 'paypal', label: '🅿️ PayPal' },
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${paymentMethod === pm.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'stripe' && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    items={items.map(i => ({ productId: i.productId, quantity: i.quantity, variant: i.variant }))}
                    address={address}
                  />
                </Elements>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You'll be redirected to PayPal to complete your payment.</p>
                  <button className="bg-[#0070ba] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#005ea6] transition-colors">
                    Continue with PayPal
                  </button>
                </div>
              )}

              <button onClick={() => setStep(1)} className="mt-4 text-sm text-gray-500 hover:text-orange-500 font-medium">
                ← Back to Shipping
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.key} className="flex gap-3">
                  <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/60'} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Shield size={14} className="text-green-500 shrink-0" />
              <span>All transactions are secured and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
