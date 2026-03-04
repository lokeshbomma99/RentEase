import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { FaHome, FaCalendarAlt, FaRupeeSign, FaEye, FaPlus, FaChartBar } from 'react-icons/fa'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function OwnerDashboard() {
  const { t } = useTheme()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/properties/owner/analytics').then(res => setAnalytics(res.data.analytics)).finally(() => setLoading(false))
  }, [])

  const chartData = analytics?.monthlyRevenue?.map(d => ({
    name: MONTHS[d._id.month - 1], revenue: d.revenue, bookings: d.bookings,
  })) || []

  const statCards = [
    { label: t('totalProperties'), value: analytics?.totalProperties, icon: <FaHome size={24}/>, color: 'blue', link: '/owner/properties' },
    { label: t('totalBookings'), value: analytics?.totalBookings, icon: <FaCalendarAlt size={24}/>, color: 'green', link: '/owner/bookings' },
    { label: t('totalRevenue'), value: `Rs. ${(analytics?.totalRevenue || 0).toLocaleString()}`, icon: <FaRupeeSign size={24}/>, color: 'purple', link: '/owner/bookings' },
    { label: t('totalViews'), value: analytics?.totalViews, icon: <FaEye size={24}/>, color: 'orange', link: '/owner/properties' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('ownerDashboard')}</h1>
          <Link to="/owner/properties/add" className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 text-sm">
            <FaPlus/> {t('addProperty')}
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(c => (
            <Link to={c.link} key={c.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 bg-${c.color}-100 text-${c.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{c.label}</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{loading ? '...' : c.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><FaChartBar className="text-blue-600"/> {t('occupancy')}</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{t('available')}</span>
                    <span className="font-semibold text-green-600">{analytics.availableCount}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${analytics.totalProperties ? (analytics.availableCount/analytics.totalProperties*100) : 0}%`}}/>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{t('rented')}</span>
                    <span className="font-semibold text-red-500">{analytics.rentedCount}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: `${analytics.totalProperties ? (analytics.rentedCount/analytics.totalProperties*100) : 0}%`}}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t('monthlyBookings')}</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb' }}/>
                    <Bar dataKey="bookings" fill="#3b82f6" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-10">No booking data yet</p>}
            </div>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t('monthlyRevenue')}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `Rs.${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f9fafb' }} formatter={v => [`Rs. ${v.toLocaleString()}`, t('totalRevenue')]}/>
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg dark:text-white mb-4">{t('quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/owner/properties/add" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">+ {t('addProperty')}</Link>
            <Link to="/owner/properties" className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50">{t('viewProperties')}</Link>
            <Link to="/owner/bookings" className="border border-green-600 text-green-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50">{t('manageBookings')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
