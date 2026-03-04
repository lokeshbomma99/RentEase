import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import PropertyCard from '../../components/common/PropertyCard.jsx'
import MapView from '../../components/common/MapView.jsx'
import api from '../../services/api.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaSearch, FaHome, FaMap, FaThLarge, FaFilter, FaTimes } from 'react-icons/fa'

export default function Home() {
  const { t } = useTheme()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ city: '', type: '', minPrice: '', maxPrice: '', furnished: false, parking: false, petFriendly: false })

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.city) params.append('city', filters.city)
      if (filters.type) params.append('type', filters.type)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.furnished) params.append('furnished', 'true')
      if (filters.parking) params.append('parking', 'true')
      if (filters.petFriendly) params.append('petFriendly', 'true')
      const res = await api.get(`/properties?${params}`)
      setProperties(res.data.properties)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProperties() }, [])

  const clearFilters = () => setFilters({ city: '', type: '', minPrice: '', maxPrice: '', furnished: false, parking: false, petFriendly: false })
  const hasActiveFilters = filters.city || filters.type || filters.minPrice || filters.maxPrice || filters.furnished || filters.parking || filters.petFriendly

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">{t('findHome')}</h1>
        <p className="text-blue-100 mb-8">{t('browseProperties')}</p>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-wrap gap-3">
          <input className="flex-1 min-w-36 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('city') || 'City...'} value={filters.city}
            onChange={e => setFilters({...filters, city: e.target.value})}
            onKeyDown={e => e.key === 'Enter' && fetchProperties()}/>
          <select className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
            <option value="">{t('allTypes')}</option>
            {['apartment','house','villa','studio','room'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
          <input type="number" className="w-28 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('minPrice')} value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})}/>
          <input type="number" className="w-28 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('maxPrice')} value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})}/>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${showFilters ? 'bg-blue-50 border-blue-400 text-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
            <FaFilter size={12}/> {t('filters')}
          </button>
          <button onClick={fetchProperties} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <FaSearch /> {t('search')}
          </button>
        </div>
        {showFilters && (
          <div className="max-w-4xl mx-auto mt-3 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-wrap gap-4 items-center">
            {[['furnished', t('furnished')], ['parking', t('parking')], ['petFriendly', t('petFriendly')]].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={filters[k]} onChange={e => setFilters({...filters, [k]: e.target.checked})} className="w-4 h-4 rounded text-blue-600"/> {l}
              </label>
            ))}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="ml-auto text-red-500 text-xs flex items-center gap-1 hover:underline">
                <FaTimes size={10}/> {t('clearAll')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaHome className="text-blue-600"/> {t('properties')}
            <span className="text-sm font-normal text-gray-400">({properties.length} {t('found')})</span>
          </h2>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
              <FaThLarge size={13}/> {t('grid')}
            </button>
            <button onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
              <FaMap size={13}/> {t('map')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_,i) => <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"/>)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaHome size={48} className="mx-auto mb-4 opacity-30"/>
            <p>{t('noProperties')}</p>
            {hasActiveFilters && <button onClick={clearFilters} className="mt-3 text-blue-600 hover:underline text-sm">{t('clearFilters')}</button>}
          </div>
        ) : viewMode === 'map' ? (
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '600px' }}>
            <MapView properties={properties}/>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map(p => <PropertyCard key={p._id} property={p}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
