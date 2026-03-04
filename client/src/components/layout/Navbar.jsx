import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { FaHome, FaBars, FaTimes, FaBell, FaMoon, FaSun, FaUser, FaHeart } from 'react-icons/fa'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { darkMode, setDarkMode, language, setLanguage, t } = useTheme()
  const { notifications, unreadCount, markAllRead, deleteNotif } = useNotifications()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const notifRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const roleLinks = () => {
    if (!user) return null
    if (user.role === 'admin') return (<>
      <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/admin/users" className="nav-link">Users</Link>
      <Link to="/admin/properties" className="nav-link">Properties</Link>
      <Link to="/admin/reviews" className="nav-link">Reviews</Link>
      <Link to="/admin/broadcast" className="nav-link">Email</Link>
    </>)
    if (user.role === 'owner') return (<>
      <Link to="/owner/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/owner/properties" className="nav-link">{t('properties')}</Link>
      <Link to="/owner/bookings" className="nav-link">{t('bookings')}</Link>
    </>)
    return (<>
      <Link to="/my-bookings" className="nav-link">{t('myBookings')}</Link>
      <Link to="/wishlist" className="nav-link flex items-center gap-1"><FaHeart size={12}/>{t('wishlist')}</Link>
    </>)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <FaHome /> RentEase
        </Link>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/" className="nav-link">{t('home')}</Link>
          {roleLinks()}

          {/* Language Switcher */}
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 dark:text-white focus:outline-none">
            <option value="en">EN</option>
            <option value="gu">ગુ</option>
            <option value="hi">हि</option>
          </select>

          {/* Dark Mode Toggle */}
          {/* <button onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {darkMode ? <FaSun size={15}/> : <FaMoon size={15}/>}
          </button> */}

          {/* Notifications Bell */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotif(!showNotif); if (!showNotif) markAllRead() }}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <FaBell size={15} className="text-gray-600 dark:text-gray-300"/>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b dark:border-gray-700 flex justify-between items-center">
                    <span className="font-semibold dark:text-white">Notifications</span>
                    <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-400 py-8 text-sm">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n._id} className={`px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                        <div className="flex-1">
                          <p className="text-sm font-medium dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => deleteNotif(n._id)} className="text-gray-300 hover:text-red-400 text-xs mt-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-xl transition-colors">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover"/>
                ) : (
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-700 dark:text-gray-200 capitalize">{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600">
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg text-sm hover:bg-blue-50">{t('login')}</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">{t('register')}</Link>
            </div>
          )}
        </div>

        <button className="md:hidden dark:text-white" onClick={() => setOpen(!open)}>
          {open ? <FaTimes size={22}/> : <FaBars size={22}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <Link to="/" onClick={() => setOpen(false)} className="dark:text-white">{t('home')}</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="dark:text-white">{t('profile')}</Link>
              <button onClick={handleLogout} className="text-left text-red-500">{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="dark:text-white">{t('login')}</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="dark:text-white">{t('register')}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
