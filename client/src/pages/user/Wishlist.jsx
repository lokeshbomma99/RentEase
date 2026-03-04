import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import PropertyCard from '../../components/common/PropertyCard.jsx'
import api from '../../services/api.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaHeart } from 'react-icons/fa'

export default function Wishlist() {
  const { t } = useTheme()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/wishlist').then(res => setWishlist(res.data.wishlist)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <FaHeart className="text-red-500"/> {t('myWishlist')}
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_,i) => <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"/>)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaHeart size={48} className="mx-auto mb-4 opacity-30"/>
            <p>{t('noWishlist')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(item => item.property && <PropertyCard key={item._id} property={item.property}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
