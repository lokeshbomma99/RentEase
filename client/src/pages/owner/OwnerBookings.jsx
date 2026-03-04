import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function OwnerBookings() {
  const { t } = useTheme()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectId, setRejectId] = useState(null)

  useEffect(() => {
    api.get('/bookings/owner-bookings').then(res => setBookings(res.data.bookings)).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status, reason = '') => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status, rejectionReason: reason })
      setBookings(bookings.map(b => b._id === id ? res.data.booking : b))
      toast.success(`${t('bookings')} ${t(status)}!`)
      setRejectId(null)
      setRejectionReason('')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red', cancelled: 'gray' }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('bookings')}</h1>
        {loading ? (
          <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"/>)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('noBookingsYet')}</div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const c = statusColor[b.status] || 'gray'
              return (
                <div key={b._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex gap-4">
                      {b.property?.images?.[0] && (
                        <img src={b.property.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{b.property?.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">👤 {b.tenant?.name} • {b.tenant?.email}</p>
                        {b.tenant?.phone && <p className="text-gray-500 dark:text-gray-400 text-sm">📞 {b.tenant.phone}</p>}
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                        </p>
                        <p className="font-semibold text-blue-600 mt-1">Rs. {b.totalAmount?.toLocaleString()}</p>
                        {b.message && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 italic">"{b.message}"</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-${c}-100 text-${c}-700`}>
                        {t(b.status)}
                      </span>
                      {b.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(b._id, 'approved')}
                            className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-green-600">
                            {t('approved')}
                          </button>
                          <button onClick={() => setRejectId(b._id)}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-600">
                            {t('rejected')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {rejectId === b._id && (
                    <div className="mt-4 border-t dark:border-gray-700 pt-4">
                      <input
                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                        placeholder="Rejection reason (optional)..."
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(b._id, 'rejected', rejectionReason)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-600">
                          {t('confirmReject')}
                        </button>
                        <button onClick={() => setRejectId(null)}
                          className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-4 py-1.5 rounded-lg text-xs">
                          {t('cancelled')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
