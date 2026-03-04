import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaCheck, FaMapMarkerAlt } from 'react-icons/fa'

export default function AdminProperties() {
  const { t } = useTheme()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/properties/pending').then(res => setProperties(res.data.properties)).finally(() => setLoading(false))
  }, [])

  const approve = async (id) => {
    try {
      await api.put(`/admin/properties/${id}/approve`)
      setProperties(properties.filter(p => p._id !== id))
      toast.success('Property approved!')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('approveProperties')}</h1>
        {loading ? (
          <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"/>)}</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('noPendingProperties')}</div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => (
              <div key={p._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt="" className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">{t('noImg')}</div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{p.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                    <FaMapMarkerAlt size={11}/>{p.address?.city}, {p.address?.state}
                  </p>
                  <p className="text-blue-600 font-semibold text-sm mt-1">Rs. {p.price?.toLocaleString()}/mo</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t('owner')}: {p.owner?.name} • {p.owner?.email}</p>
                </div>
                <button onClick={() => approve(p._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-green-600 flex-shrink-0">
                  <FaCheck/> {t('approved')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
