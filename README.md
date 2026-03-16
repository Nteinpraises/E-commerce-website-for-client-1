# 🛒 MarketVault — Multi-Vendor E-Commerce Platform

A fully functional Alibaba-style multi-vendor marketplace with React frontend, Node.js backend, Stripe & PayPal payment integration.

---

## 📁 Project Structure

```
ecommerce/
├── frontend/          # React app (UI)
│   └── src/
│       ├── components/    # Reusable UI components
│       │   ├── layout/    # Navbar, Footer
│       │   └── product/   # ProductCard
│       ├── context/       # AuthContext, CartContext (Zustand)
│       ├── pages/         # All page components
│       └── services/      # API service layer
└── backend/           # Node.js + Express API
    ├── models/        # MongoDB schemas (User, Vendor, Product, Order, etc.)
    ├── controllers/   # Business logic
    ├── routes/        # API route definitions
    ├── middleware/    # Auth middleware
    ├── config/        # DB connection
    └── utils/         # Email utility
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- Stripe account → [stripe.com](https://stripe.com)
- PayPal developer account → [developer.paypal.com](https://developer.paypal.com)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your values in .env
npm start
```

Frontend runs at: `http://localhost:3000`

---

## ⚙️ Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Random secret string (min 32 chars) |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks |
| `PAYPAL_CLIENT_ID` | From PayPal Developer Dashboard |
| `PAYPAL_SECRET` | From PayPal Developer Dashboard |
| `CLOUDINARY_*` | For image uploads (sign up at cloudinary.com) |
| `EMAIL_*` | SMTP credentials for password reset emails |

### Frontend `.env`
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend URL |
| `REACT_APP_STRIPE_PUBLIC_KEY` | From Stripe Dashboard (starts with `pk_`) |
| `REACT_APP_PAYPAL_CLIENT_ID` | PayPal Client ID |

---

## 🌐 Deployment

### Option A: Deploy to Railway (Easiest, Free Tier)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add backend service → Set environment variables
4. Add MongoDB service (or use Atlas)
5. Add frontend service → Set `REACT_APP_API_URL` to your backend URL
6. Done! Railway auto-deploys on every push.

---

### Option B: Deploy to Render (Free)

**Backend:**
```
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Root Directory: backend
4. Build Command: npm install
5. Start Command: npm start
6. Add environment variables
```

**Frontend:**
```
1. New Static Site on Render
2. Root Directory: frontend
3. Build Command: npm run build
4. Publish Directory: build
5. Add environment variables
```

---

### Option C: Deploy to VPS (DigitalOcean / AWS / Hetzner)

```bash
# On your server
git clone your-repo
cd ecommerce

# Backend
cd backend && npm install
npm install -g pm2
pm2 start server.js --name "ecommerce-api"
pm2 save

# Frontend
cd ../frontend && npm install && npm run build
# Serve build/ with Nginx

# Nginx config example:
# server {
#   listen 80;
#   server_name yourdomain.com;
#   root /path/to/frontend/build;
#   index index.html;
#   try_files $uri $uri/ /index.html;
#   location /api {
#     proxy_pass http://localhost:5000;
#   }
# }
```

---

## 🔧 Customization Guide

### Change Brand Name & Colors
- **Name**: Search and replace `MarketVault` across all files
- **Colors**: Edit `tailwind.config.js` — change `orange` palette to your brand color
- **Logo**: Replace the `MV` initials in `Navbar.js`

### Add New Product Categories
```js
// backend/routes/categories.js — POST /api/categories
// Or seed directly in MongoDB:
db.categories.insertMany([
  { name: "New Category", slug: "new-category", isActive: true }
])
```

### Add a New Page
1. Create `frontend/src/pages/NewPage.js`
2. Add route in `frontend/src/App.js`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add link in `Navbar.js`

### Add a New API Endpoint
1. Create controller in `backend/controllers/`
2. Create route in `backend/routes/`
3. Register route in `backend/server.js`
4. Add API call in `frontend/src/services/api.js`

### Add Image Upload (Cloudinary)
```js
// Already configured — just set CLOUDINARY_* env vars
// Then in your controller:
const cloudinary = require('cloudinary').v2;
const result = await cloudinary.uploader.upload(req.file.path);
// result.secure_url = image URL
```

### Add Mobile App Support
The backend is a REST API — just point your React Native / Flutter app to the same endpoints. All auth uses JWT tokens which work seamlessly with mobile.

---

## 📱 Features Overview

| Feature | Status |
|---------|--------|
| Multi-vendor marketplace | ✅ |
| Buyer / Vendor / Admin roles | ✅ |
| Product catalog with filters | ✅ |
| Product variants (size, color, etc.) | ✅ |
| Shopping cart (persisted) | ✅ |
| Stripe payments | ✅ |
| PayPal payments | ✅ |
| Order management | ✅ |
| Vendor dashboard | ✅ |
| Reviews & ratings | ✅ |
| Wishlist | ✅ |
| Search | ✅ |
| Email notifications | ✅ |
| Responsive design | ✅ |
| JWT authentication | ✅ |
| Password reset | ✅ |

---

## 🔒 Security Features
- JWT authentication with expiry
- Bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min)
- Helmet.js security headers
- CORS protection
- Input validation
- Stripe webhook verification
- Role-based access control

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| State | Zustand (cart), Context API (auth) |
| Payments | Stripe, PayPal |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, Bcrypt |
| Images | Cloudinary |
| Email | Nodemailer |
| Deployment | Railway / Render / VPS |

---

## 📞 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/products | List products (filterable) |
| GET | /api/products/:id | Get product detail |
| POST | /api/products | Create product (vendor) |
| GET | /api/orders/my | Get buyer orders |
| POST | /api/payments/create-payment-intent | Create Stripe payment |
| POST | /api/payments/webhook | Stripe webhook |

---

Built with ❤️ — Ready to extend and scale.
