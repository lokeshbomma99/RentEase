import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaPlus, FaTrash, FaEdit, FaMapMarkerAlt } from 'react-icons/fa'

export default function OwnerProperties() {
  const { t } = useTheme()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/properties/owner/my-properties').then(res => setProperties(res.data.properties)).finally(() => setLoading(false))
  }, [])

  const deleteProperty = async (id) => {
    if (!confirm(t('deleteProperty') + '?')) return
    try {
      await api.delete(`/properties/${id}`)
      setProperties(properties.filter(p => p._id !== id))
      toast.success('Property deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('properties')}</h1>
          <Link to="/owner/properties/add" className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 text-sm">
            <FaPlus/> {t('addProperty')}
          </Link>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"/>)}</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No properties yet.</div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => (
              <div key={p._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover"/> :
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{p.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1"><FaMapMarkerAlt size={11}/>{p.address?.city}, {p.address?.state}</p>
                  <div className="flex gap-3 mt-1 flex-wrap">
                    <span className="text-blue-600 font-semibold text-sm">Rs. {p.price?.toLocaleString()}/mo</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.isApproved ? t('approved') : t('pending')}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">{t(p.status)}</span>
                    <span className="text-xs text-gray-400">👁 {p.views || 0} {t('totalViews')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/owner/properties/edit/${p._id}`} className="text-blue-400 hover:text-blue-600 p-2"><FaEdit size={16}/></Link>
                  <button onClick={() => deleteProperty(p._id)} className="text-red-400 hover:text-red-600 p-2"><FaTrash size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
