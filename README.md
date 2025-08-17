# Night Cloud Kitchen — IIT Madras (10 PM – 8 AM)

A production-ready full-stack web app for placing night-time food orders for IIT Madras students.
- Service hours: 22:00–08:00 IST (configurable)
- Pickup/Delivery point: Taramani Gate
- Source: Bihari Dhaba
- No hidden fees; affordable pricing with loyalty/discounts

## Stack
**Frontend:** React (Vite) + Tailwind + React Router + Socket.IO client  
**Backend:** Node.js + Express + MongoDB (Mongoose) + Socket.IO + Firebase Admin (phone OTP) + Razorpay  
**Hosting:** Vercel (frontend), Render/Heroku (backend), MongoDB Atlas (DB)

## Live features
- Phone OTP login via Firebase Auth (frontend). Backend verifies Firebase ID token.
- First login collects Name + Hostel Address (stored securely).
- Menu with search, filters (veg/non-veg, price), best sellers.
- Cart + Checkout with COD or Razorpay (UPI/Cards/Wallets).
- Real-time order status: Preparing → Out for Delivery → Ready at Taramani Gate.
- Discount coupons + automatic loyalty discounts + referral codes.
- Admin dashboard: manage menu, orders, statuses, & daily sales.
- Dark mode UI (default).
- "Open Now" banner based on service window.
- Optional web push (scaffolded).

## Monorepo
```
night-kitchen/
  backend/
  frontend/
```

---

## 1) Backend — Setup

### Prereqs
- Node 18+
- MongoDB Atlas connection string
- Razorpay test keys
- Firebase Admin service account (to verify client ID tokens from phone OTP)

### Configure
Create `backend/.env`:
```
PORT=8080
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=supersecret-long-random
SERVICE_START_HH=22
SERVICE_END_HH=8
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
# Path or JSON string for Firebase Admin credentials (choose ONE)
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
# or
FIREBASE_ADMIN_CREDENTIALS_JSON={"type":"service_account", ...}
FRONTEND_ORIGIN=http://localhost:5173
```

Place your Firebase service account JSON at `backend/firebase-service-account.json` if using the path method.

### Install & run
```
cd backend
npm i
npm run dev
# seeds menu, admin user, and default coupons:
npm run seed
```

Admin test user (created by seed):
- **Email**: admin@dhaba.local (only for dashboard login; not used for student auth)
- **Password**: admin123

> Student login is via phone OTP on the frontend. After successful Firebase phone auth, the frontend sends the Firebase ID token to the backend; backend returns its own session JWT.

### Production build
- Deploy to Render/Heroku. Set the same env vars.
- Ensure `FRONTEND_ORIGIN` is set to your Vercel URL for CORS.

---

## 2) Frontend — Setup

Create `frontend/.env`:
```
VITE_API_BASE=http://localhost:8080
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx

# Firebase client (phone auth)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
```

Install & run:
```
cd frontend
npm i
npm run dev
```

Build:
```
npm run build
```

### Test Accounts
- Admin (dashboard): email `admin@dhaba.local` / password `admin123`
- Student: use your own phone in Firebase Auth test mode; reCAPTCHA will be handled by Firebase on client.

---

## Seeded Menu
The backend seed inserts the full provided dataset.

---

## Deployment Notes
- **Frontend on Vercel:** set env vars above. Add your backend URL to allowed origins in backend `.env` (`FRONTEND_ORIGIN`).
- **Backend on Render/Heroku:** add env vars and upload Firebase service account (either as file at runtime or as JSON env).
- **Razorpay:** use Test mode keys for non-production.

---

## Security
- Backend trusts only Firebase ID tokens (student auth) and issues a short-lived session JWT.
- Rate limiting for auth & orders.
- Service window enforced server-side for new orders.
- Admin routes separated, require email/password (+ JWT).

---

Happy shipping! 🚚🌙
