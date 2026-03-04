import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import MapView from '../../components/common/MapView.jsx'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import toast from 'react-hot-toast'
import { FaBed, FaBath, FaMapMarkerAlt, FaStar, FaPhone, FaRulerCombined, FaCar, FaPaw, FaCouch } from 'react-icons/fa'

export default function PropertyDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { t } = useTheme()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [reviews, setReviews] = useState([])
  const [booking, setBooking] = useState({ startDate: '', endDate: '', message: '' })
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    api.get(`/properties/${id}`).then(res => setProperty(res.data.property)).finally(() => setLoading(false))
    api.get(`/reviews/property/${id}`).then(res => setReviews(res.data.reviews))
  }, [id])

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      const months = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24 * 30)))
      await api.post('/bookings', { property: id, ...booking, totalAmount: property.price * months })
      toast.success(t('sendBookingRequest') + ' ✅')
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed') }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      const res = await api.post('/reviews', { property: id, ...review })
      setReviews([res.data.review, ...reviews])
      setReview({ rating: 5, comment: '' })
      toast.success('Review added!')
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed') }
  }

  if (loading) return <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/></div>
  if (!property) return <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center text-gray-500">Property not found</div>

  const months = booking.startDate && booking.endDate
    ? Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000*60*60*24*30)))
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow">
              <div className="relative h-80 bg-gray-200 dark:bg-gray-700">
                {property.images?.length > 0
                  ? <img src={property.images[activeImg]} alt={property.title} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
              </div>
              {property.images?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                      className={`h-16 w-24 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${i === activeImg ? 'ring-2 ring-blue-600 opacity-100' : 'opacity-60 hover:opacity-100'}`}/>
                  ))}
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full capitalize">{property.type}</span>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{property.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><FaMapMarkerAlt size={13}/>{property.address?.street}, {property.address?.city}, {property.address?.state}</p>
                    {property.averageRating > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
                        <FaStar/> {property.averageRating} <span className="text-gray-400">({property.totalReviews} {t('reviews')})</span>
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-blue-600">Rs. {property.price?.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg"><FaBed className="text-blue-500"/> {property.features?.bedrooms} {t('beds')}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg"><FaBath className="text-blue-500"/> {property.features?.bathrooms} {t('baths')}</span>
                  {property.features?.area && <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg"><FaRulerCombined className="text-blue-500"/> {property.features.area} sqft</span>}
                  {property.features?.furnished && <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg"><FaCouch/> {t('furnished')}</span>}
                  {property.features?.parking && <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg"><FaCar/> {t('parking')}</span>}
                  {property.features?.petFriendly && <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg"><FaPaw/> {t('petFriendly')}</span>}
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
                {property.amenities?.length > 0 && (
                  <div className="mt-5">
                    <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">{t('amenities')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map(a => <span key={a} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm px-3 py-1.5 rounded-full">{a}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {property.location?.lat && property.location?.lng && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                  <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600"/> {t('locationOnMap')}</h2>
                </div>
                <div style={{ height: '300px' }}><MapView properties={[property]} single={true}/></div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('reviews')} ({reviews.length})</h2>
              {user?.role === 'user' && (
                <form onSubmit={handleReview} className="mb-6 space-y-3 border-b dark:border-gray-700 pb-6">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium dark:text-gray-300">{t('rating')}:</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(r => (
                        <button key={r} type="button" onClick={() => setReview({...review, rating: r})}
                          className={`text-2xl transition-colors ${r <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} required
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    placeholder={t('shareExperience')}/>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-700">{t('submitReview')}</button>
                </form>
              )}
              <div className="space-y-4">
                {reviews.length === 0
                  ? <p className="text-gray-400 text-sm">{t('noReviews')}</p>
                  : reviews.map(r => (
                    <div key={r._id} className="border-b dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{r.user?.name?.[0]?.toUpperCase()}</div>
                        <span className="font-medium text-sm dark:text-white">{r.user?.name}</span>
                        <span className="text-yellow-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                        <span className="text-gray-400 text-xs ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm ml-10">{r.comment}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow sticky top-20">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">{t('ownerDetails')}</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {property.owner?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{property.owner?.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{property.owner?.email}</p>
                </div>
              </div>
              {property.owner?.phone && <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-4"><FaPhone size={12}/>{property.owner.phone}</p>}

              {user?.role === 'user' && (
                <>
                  <hr className="mb-4 dark:border-gray-700"/>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">{t('bookThisProperty')}</h3>
                  <form onSubmit={handleBooking} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('moveIn')}</label>
                      <input type="date" required value={booking.startDate} min={new Date().toISOString().split('T')[0]}
                        onChange={e => setBooking({...booking, startDate: e.target.value})}
                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('moveOut')}</label>
                      <input type="date" required value={booking.endDate} min={booking.startDate}
                        onChange={e => setBooking({...booking, endDate: e.target.value})}
                        className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    {months > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-sm">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>{t('duration')}</span><span>{months} {t('months')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-blue-600 mt-1">
                          <span>{t('total')}</span><span>Rs. {(property.price * months).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    <textarea value={booking.message} onChange={e => setBooking({...booking, message: e.target.value})}
                      className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
                      placeholder={t('messageForOwner')}/>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700">{t('sendBookingRequest')}</button>
                  </form>
                </>
              )}
              {!user && (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                  <a href="/login" className="text-blue-600 font-medium">{t('login')}</a> {t('loginToBook')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
