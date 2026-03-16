import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, Shield, Store, Minus, Plus, Share2 } from 'lucide-react';
import { getProduct, getProductReviews, createReview } from '../services/api';
import { useCartStore } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const addItem = useCartStore(s => s.addItem);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProduct(id), getProductReviews(id)]).then(([p, r]) => {
      setProduct(p.data.product);
      setReviews(r.data.reviews);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found</div>;

  const mainImage = product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600';
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    toast.success('Added to cart!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      const res = await createReview({ ...reviewForm, product: product._id });
      setReviews(prev => [res.data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-500">Home</Link> /
        <Link to="/products" className="hover:text-orange-500 mx-2">Products</Link> /
        <span className="text-gray-900 ml-2">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedImage === i ? 'border-orange-500' : 'border-gray-200'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.vendor && (
            <Link to={`/vendors/${product.vendor._id}`} className="inline-flex items-center gap-2 text-orange-500 font-medium text-sm mb-3 hover:text-orange-600">
              <Store size={16} /> {product.vendor.storeName}
            </Link>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={18} className={s <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} ({product.totalReviews} reviews)</span>
            <span className="text-sm text-green-600">{product.totalSales} sold</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-black text-gray-900">${product.price?.toFixed(2)}</span>
            {discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.comparePrice?.toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 font-bold text-sm px-3 py-1 rounded-full">Save {discount}%</span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && <p className="text-gray-600 mb-6">{product.shortDescription}</p>}

          {/* Variants */}
          {product.variants?.map(variant => (
            <div key={variant.name} className="mb-4">
              <p className="font-semibold text-gray-900 mb-2">{variant.name}</p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedVariant({ name: variant.name, value: opt.value })}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedVariant?.value === opt.value ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-semibold text-gray-900">Quantity:</p>
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">
                <Minus size={16} />
              </button>
              <span className="px-5 py-2 font-bold text-gray-900 min-w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.stock} available</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="border-2 border-gray-200 p-4 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors">
              <Heart size={22} />
            </button>
            <button className="border-2 border-gray-200 p-4 rounded-xl hover:border-gray-400 transition-colors">
              <Share2 size={22} />
            </button>
          </div>

          {/* Shipping info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck size={18} className="text-orange-500 shrink-0" />
              <span className="text-gray-700">{product.freeShipping ? 'Free shipping' : `Shipping: $${product.shippingCost?.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield size={18} className="text-orange-500 shrink-0" />
              <span className="text-gray-700">Buyer protection guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-b border-gray-200">
        {['description', 'specifications', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
          >
            {tab} {tab === 'reviews' && `(${reviews.length})`}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === 'description' && (
          <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
        )}
        {activeTab === 'specifications' && (
          <div className="max-w-2xl">
            {product.specifications?.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="font-medium text-gray-700 px-4 py-3 w-1/3">{spec.key}</td>
                      <td className="text-gray-600 px-4 py-3">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-gray-500">No specifications available.</p>}
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl space-y-6">
            {user && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                <div className="flex gap-2 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                      <Star size={24} className={s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-3 outline-none focus:border-orange-500" placeholder="Review title" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-3 outline-none focus:border-orange-500 resize-none" rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required />
                <button type="submit" className="bg-orange-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Submit Review
                </button>
              </form>
            )}
            {reviews.map(review => (
              <div key={review._id} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {review.buyer?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.buyer?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}
                  </div>
                </div>
                {review.title && <p className="font-semibold text-gray-800 mb-1">{review.title}</p>}
                <p className="text-gray-600 text-sm">{review.comment}</p>
                {review.isVerifiedPurchase && <span className="text-xs text-green-600 font-medium mt-2 inline-block">✓ Verified Purchase</span>}
              </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
