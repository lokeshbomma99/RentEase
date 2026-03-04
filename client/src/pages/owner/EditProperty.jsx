import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import ImageUpload from '../../components/common/ImageUpload.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTheme()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageFiles, setImageFiles] = useState([])
  const [keepImages, setKeepImages] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', price: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'India' },
    location: { lat: '', lng: '' },
    features: { bedrooms: 1, bathrooms: 1, area: '', furnished: false, parking: false, petFriendly: false },
    amenities: '',
  })

  useEffect(() => {
    api.get(`/properties/${id}`).then(res => {
      const p = res.data.property
      setForm({
        title: p.title, description: p.description, type: p.type, price: p.price,
        address: p.address,
        location: { lat: p.location?.lat || '', lng: p.location?.lng || '' },
        features: p.features,
        amenities: p.amenities?.join(', ') || '',
      })
      setKeepImages(p.images || [])
    }).finally(() => setFetching(false))
  }, [id])

  const set = (key, val) => setForm(f => ({...f, [key]: val}))
  const setAddr = (k, v) => setForm(f => ({...f, address: {...f.address, [k]: v}}))
  const setLoc = (k, v) => setForm(f => ({...f, location: {...f.location, [k]: v}}))
  const setFeat = (k, v) => setForm(f => ({...f, features: {...f.features, [k]: v}}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('type', form.type)
      formData.append('price', form.price)
      formData.append('address', JSON.stringify(form.address))
      formData.append('features', JSON.stringify({ ...form.features, area: Number(form.features.area) || 0 }))
      formData.append('amenities', JSON.stringify(form.amenities.split(',').map(s => s.trim()).filter(Boolean)))
      if (form.location.lat && form.location.lng) {
        formData.append('location', JSON.stringify({ lat: Number(form.location.lat), lng: Number(form.location.lng) }))
      }
      imageFiles.forEach(file => formData.append('images', file))
      await api.put(`/properties/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(t('updateProperty') + ' ✅')
      navigate('/owner/properties')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const section = "bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4"

  if (fetching) return (
    <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('editPropertyTitle')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('propertyImages')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current images:</p>
            <div className="flex gap-2 flex-wrap">
              {keepImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl"/>
                  <button type="button" onClick={() => setKeepImages(keepImages.filter((_,j) => j !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload new images:</p>
            <ImageUpload onChange={setImageFiles} maxFiles={8}/>
          </div>

          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('basicInfo')}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input required className={inputCls} value={form.title} onChange={e => set('title', e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea required className={inputCls + ' h-24 resize-none'} value={form.description} onChange={e => set('description', e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                  {['apartment','house','villa','studio','room'].map(tp => <option key={tp} value={tp}>{tp}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (Rs/month)</label>
                <input type="number" required className={inputCls} value={form.price} onChange={e => set('price', e.target.value)}/>
              </div>
            </div>
          </div>

          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('address')}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
              <input required className={inputCls} value={form.address.street} onChange={e => setAddr('street', e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input required className={inputCls} value={form.address.city} onChange={e => setAddr('city', e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <input required className={inputCls} value={form.address.state} onChange={e => setAddr('state', e.target.value)}/>
              </div>
            </div>
          </div>

          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('features')}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('beds')}</label>
                <input type="number" min="0" className={inputCls} value={form.features.bedrooms} onChange={e => setFeat('bedrooms', Number(e.target.value))}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('baths')}</label>
                <input type="number" min="0" className={inputCls} value={form.features.bathrooms} onChange={e => setFeat('bathrooms', Number(e.target.value))}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (sqft)</label>
                <input type="number" className={inputCls} value={form.features.area} onChange={e => setFeat('area', e.target.value)}/>
              </div>
            </div>
            <div className="flex gap-6">
              {[['furnished', t('furnished')], ['parking', t('parking')], ['petFriendly', t('petFriendly')]].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300">
                  <input type="checkbox" checked={form.features[k]} onChange={e => setFeat(k, e.target.checked)} className="w-4 h-4 rounded"/> {l}
                </label>
              ))}
            </div>
          </div>

          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('amenities')}</h2>
            <input className={inputCls} value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="WiFi, AC, Gym (comma separated)"/>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? t('uploading') : t('updateProperty')}
          </button>
        </form>
      </div>
    </div>
  )
}
