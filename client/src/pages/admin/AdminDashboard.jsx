import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { FaUsers, FaHome, FaCalendarAlt, FaClock, FaRupeeSign, FaChartLine } from 'react-icons/fa'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const { t } = useTheme()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data.stats)).finally(() => setLoading(false))
  }, [])

  const userChartData = stats?.userGrowth?.map(d => ({ name: MONTHS[d._id.month - 1], users: d.count })) || []
  const bookingChartData = stats?.bookingStats?.map(d => ({ name: MONTHS[d._id.month - 1], bookings: d.count, revenue: d.revenue })) || []

  const cards = [
    { label: t('users'), key: 'totalUsers', icon: <FaUsers size={22}/>, color: 'blue', link: '/admin/users' },
    { label: t('properties'), key: 'totalProperties', icon: <FaHome size={22}/>, color: 'green', link: '/admin/properties' },
    { label: t('bookings'), key: 'totalBookings', icon: <FaCalendarAlt size={22}/>, color: 'purple', link: '/admin/properties' },
    { label: t('pending'), key: 'pendingProperties', icon: <FaClock size={22}/>, color: 'yellow', link: '/admin/properties' },
    { label: t('totalRevenue'), key: 'totalRevenue', icon: <FaRupeeSign size={22}/>, color: 'indigo', link: '/admin/properties', prefix: 'Rs. ' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
          <FaChartLine className="text-blue-600"/> {t('adminDashboard')}
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {cards.map(c => (
            <Link to={c.link} key={c.key} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 bg-${c.color}-100 text-${c.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{c.label}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{loading ? '...' : `${c.prefix || ''}${stats?.[c.key]?.toLocaleString()}`}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">User Growth (Last 6 Months)</h3>
            {userChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border:'none', color:'#f9fafb' }}/>
                  <Bar dataKey="users" fill="#3b82f6" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm text-center py-16">No data yet</p>}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Revenue Trend (Last 6 Months)</h3>
            {bookingChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bookingChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border:'none', color:'#f9fafb' }} formatter={v => [`Rs. ${v.toLocaleString()}`, t('totalRevenue')]}/>
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }}/>
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm text-center py-16">No data yet</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg dark:text-white mb-4">{t('quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/users" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">{t('manageUsers')}</Link>
            <Link to="/admin/properties" className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700">{t('approveProperties')}</Link>
            <Link to="/admin/reviews" className="bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-yellow-700">{t('manageReviews')}</Link>
            <Link to="/admin/broadcast" className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700">{t('broadcastEmail')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
