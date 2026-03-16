import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/auth/reset-password/${token}`, { password });

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');

// Vendors
export const getVendors = () => API.get('/vendors');
export const getVendor = (id) => API.get(`/vendors/${id}`);
export const updateVendorProfile = (data) => API.put('/vendors/profile', data);

// Orders
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getVendorOrders = () => API.get('/orders/vendor/all');
export const updateItemStatus = (orderId, itemId, data) => API.put(`/orders/${orderId}/items/${itemId}/status`, data);

// Payments
export const createPaymentIntent = (data) => API.post('/payments/create-payment-intent', data);
export const createPaypalOrder = (data) => API.post('/payments/paypal/create-order', data);
export const capturePaypalOrder = (data) => API.post('/payments/paypal/capture-order', data);

// Users
export const updateProfile = (data) => API.put('/users/profile', data);
export const addAddress = (data) => API.post('/users/address', data);
export const toggleWishlist = (productId) => API.post(`/users/wishlist/${productId}`);

// Reviews
export const getProductReviews = (productId) => API.get(`/reviews/product/${productId}`);
export const createReview = (data) => API.post('/reviews', data);

export default API;
