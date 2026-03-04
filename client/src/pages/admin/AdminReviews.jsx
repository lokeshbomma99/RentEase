import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaTrash } from 'react-icons/fa'

export default function AdminReviews() {
  const { t } = useTheme()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/reviews').then(res => setReviews(res.data.reviews)).finally(() => setLoading(false))
  }, [])

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await api.delete(`/admin/reviews/${id}`)
      setReviews(reviews.filter(r => r._id !== id))
      toast.success('Review deleted')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('manageReviews')}</h1>
        {loading ? (
          <div className="animate-pulse space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"/>)}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('noReviewsYet')}</div>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">{r.user?.name}</span>
                    <span className="text-gray-400 text-xs">on</span>
                    <span className="font-medium text-blue-600 text-sm">{r.property?.title}</span>
                    <span className="text-yellow-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{r.comment}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => deleteReview(r._id)} className="text-red-400 hover:text-red-600 p-2 flex-shrink-0">
                  <FaTrash/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
