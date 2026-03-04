import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import ImageUpload from '../../components/common/ImageUpload.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function AddProperty() {
  const { t } = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', price: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'India' },
    location: { lat: '', lng: '' },
    features: { bedrooms: 1, bathrooms: 1, area: '', furnished: false, parking: false, petFriendly: false },
    amenities: '',
  })

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
      await api.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(t('submitForApproval') + ' ✅')
      navigate('/owner/properties')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
      console.error(err.response?.data)
    } finally { setLoading(false) }
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const section = "bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4"
  const label = (text) => <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text}</label>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('addPropertyTitle')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('propertyImages')}</h2>
            <ImageUpload onChange={setImageFiles} maxFiles={8}/>
          </div>
          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('basicInfo')}</h2>
            <div>{label('Title')}<input required className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Cozy 2BHK Apartment"/></div>
            <div>{label('Description')}<textarea required className={inputCls + ' h-24 resize-none'} value={form.description} onChange={e => set('description', e.target.value)}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div>{label('Type')}<select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                {['apartment','house','villa','studio','room'].map(tp => <option key={tp} value={tp} className="capitalize">{tp}</option>)}
              </select></div>
              <div>{label('Price (Rs/month)')}<input type="number" required className={inputCls} value={form.price} onChange={e => set('price', e.target.value)} placeholder="15000"/></div>
            </div>
          </div>
          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('address')}</h2>
            <div>{label('Street')}<input required className={inputCls} value={form.address.street} onChange={e => setAddr('street', e.target.value)}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div>{label('City')}<input required className={inputCls} value={form.address.city} onChange={e => setAddr('city', e.target.value)}/></div>
              <div>{label('State')}<input required className={inputCls} value={form.address.state} onChange={e => setAddr('state', e.target.value)}/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{label('Zip Code')}<input className={inputCls} value={form.address.zipCode} onChange={e => setAddr('zipCode', e.target.value)}/></div>
              <div>{label('Country')}<input className={inputCls} value={form.address.country} onChange={e => setAddr('country', e.target.value)}/></div>
            </div>
          </div>
          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('mapLocation')} <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
            <div className="grid grid-cols-2 gap-4">
              <div>{label('Latitude')}<input type="number" step="any" className={inputCls} value={form.location.lat} onChange={e => setLoc('lat', e.target.value)} placeholder="e.g. 23.0225"/></div>
              <div>{label('Longitude')}<input type="number" step="any" className={inputCls} value={form.location.lng} onChange={e => setLoc('lng', e.target.value)} placeholder="e.g. 72.5714"/></div>
            </div>
          </div>
          <div className={section}>
            <h2 className="font-semibold dark:text-white text-lg">{t('features')}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>{label(t('beds'))}<input type="number" min="0" className={inputCls} value={form.features.bedrooms} onChange={e => setFeat('bedrooms', Number(e.target.value))}/></div>
              <div>{label(t('baths'))}<input type="number" min="0" className={inputCls} value={form.features.bathrooms} onChange={e => setFeat('bathrooms', Number(e.target.value))}/></div>
              <div>{label('Area (sqft)')}<input type="number" className={inputCls} value={form.features.area} onChange={e => setFeat('area', e.target.value)}/></div>
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
            <input className={inputCls} value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="WiFi, AC, Gym, Pool (comma separated)"/>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? t('uploading') : t('submitForApproval')}
          </button>
        </form>
      </div>
    </div>
  )
}
