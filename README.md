# 🏠 RentEase - House Rent App (MERN Stack)

A full-featured house rental platform with **Admin**, **Owner**, and **User** modules.

## 🆕 Features Added
- ☁️ **Cloudinary Image Upload** — Drag & drop multi-image upload with preview
- 📧 **Email Notifications** — Welcome, booking request, approval & rejection emails
- 🗺️ **Leaflet.js Map** — Interactive map on listings and property detail pages

## 🗂 Project Structure
```
house-rent-app/
├── server/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary + Multer setup
│   ├── controllers/            # Business logic
│   ├── middleware/             # JWT auth
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js        # Nodemailer helper
│   │   └── emailTemplates.js   # HTML email templates
│   └── index.js
│
└── client/src/
    ├── components/
    │   ├── common/
    │   │   ├── MapView.jsx       # Leaflet map component
    │   │   ├── ImageUpload.jsx   # Drag & drop uploader
    │   │   ├── PropertyCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   └── layout/Navbar.jsx
    ├── pages/
    │   ├── auth/         # Login, Register
    │   ├── user/         # Home (grid+map), PropertyDetail, MyBookings
    │   ├── owner/        # Dashboard, Properties, Bookings, AddProperty
    │   └── admin/        # Dashboard, Users, Properties
    └── App.jsx
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
cd client && npm install @tailwindcss/vite
```

### 2. Configure Environment — `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/house-rent-db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP (use App Password, not real password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=RentEase <your_gmail@gmail.com>
```

### 3. Create Admin User
```bash
cd server && node utils/seed.js
```
Login: `admin@rentease.com` / `admin123`

### 4. Run Dev Servers
```bash
npm run dev
```
- Frontend: http://localhost:5173  
- Backend:  http://localhost:5000

## 📧 Email Setup (Gmail)
1. Enable 2-Step Verification in Gmail
2. Go to Google Account → Security → App Passwords
3. Generate an App Password and use it as `EMAIL_PASS`

## 🗺️ Map Setup
No API key needed! Leaflet uses OpenStreetMap tiles for free.
When adding a property, enter lat/lng coordinates (get from Google Maps by right-clicking any location).

## 🔑 User Roles
| Role  | Capabilities |
|-------|-------------|
| **User** | Browse, filter, map view, book, review |
| **Owner** | Upload images, list properties, manage bookings |
| **Admin** | Approve properties, manage users |

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, React Leaflet, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Storage**: Cloudinary (images)
- **Email**: Nodemailer + Gmail SMTP
- **Maps**: Leaflet.js + OpenStreetMap (free, no API key)
