import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'

// Auth
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

// Shared
import ProfilePage from './pages/ProfilePage.jsx'

// User
import Home from './pages/user/Home.jsx'
import PropertyDetail from './pages/user/PropertyDetail.jsx'
import MyBookings from './pages/user/MyBookings.jsx'
import Wishlist from './pages/user/Wishlist.jsx'
import Compare from './pages/user/Compare.jsx'

// Owner
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx'
import OwnerProperties from './pages/owner/OwnerProperties.jsx'
import OwnerBookings from './pages/owner/OwnerBookings.jsx'
import AddProperty from './pages/owner/AddProperty.jsx'
import EditProperty from './pages/owner/EditProperty.jsx'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminProperties from './pages/admin/AdminProperties.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminBroadcast from './pages/admin/AdminBroadcast.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster position="top-right"/>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/compare" element={<Compare />} />

              {/* Shared (all logged-in roles) */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* User */}
              <Route path="/my-bookings" element={<ProtectedRoute role="user"><MyBookings /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute role="user"><Wishlist /></ProtectedRoute>} />

              {/* Owner */}
              <Route path="/owner/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/owner/properties" element={<ProtectedRoute role="owner"><OwnerProperties /></ProtectedRoute>} />
              <Route path="/owner/properties/add" element={<ProtectedRoute role="owner"><AddProperty /></ProtectedRoute>} />
              <Route path="/owner/properties/edit/:id" element={<ProtectedRoute role="owner"><EditProperty /></ProtectedRoute>} />
              <Route path="/owner/bookings" element={<ProtectedRoute role="owner"><OwnerBookings /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/properties" element={<ProtectedRoute role="admin"><AdminProperties /></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute role="admin"><AdminReviews /></ProtectedRoute>} />
              <Route path="/admin/broadcast" element={<ProtectedRoute role="admin"><AdminBroadcast /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
