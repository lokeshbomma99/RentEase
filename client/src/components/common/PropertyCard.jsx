import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBed, FaBath, FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function PropertyCard({ property }) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const isRented = property.status === 'rented'

  useEffect(() => {
    if (user?.role === 'user') {
      api.get(`/wishlist/check/${property._id}`).then(res => setSaved(res.data.saved)).catch(() => {})
    }
  }, [property._id, user])

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return toast.error('Login to save properties')
    try {
      const res = await api.post(`/wishlist/toggle/${property._id}`)
      setSaved(res.data.saved)
      toast.success(res.data.message)
    } catch { toast.error('Failed to update wishlist') }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden ${isRented ? 'opacity-80' : ''}`}>
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full capitalize">{property.type}</span>
        {isRented && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Rented</span>}
        {user?.role === 'user' && !isRented && (
          <button onClick={toggleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${saved ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-400'}`}>
            <FaHeart size={13}/>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white text-lg truncate">{property.title}</h3>
        <p className="text-blue-600 font-bold text-xl mt-1">Rs. {property.price?.toLocaleString()}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span></p>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
          <FaMapMarkerAlt size={12}/> {property.address?.city}, {property.address?.state}
        </div>
        <div className="flex gap-4 text-gray-500 dark:text-gray-400 text-sm mt-2">
          <span className="flex items-center gap-1"><FaBed size={13}/> {property.features?.bedrooms} Beds</span>
          <span className="flex items-center gap-1"><FaBath size={13}/> {property.features?.bathrooms} Baths</span>
          {property.averageRating > 0 && (
            <span className="flex items-center gap-1 text-yellow-500"><FaStar size={13}/> {property.averageRating}</span>
          )}
        </div>
        <Link to={`/properties/${property._id}`}
          className={`mt-3 block text-center py-2 rounded-xl text-sm font-medium transition-colors ${isRented ? 'bg-gray-400 text-white cursor-not-allowed pointer-events-none' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {isRented ? 'Currently Rented' : 'View Details'}
        </Link>
      </div>
    </div>
  )
}
