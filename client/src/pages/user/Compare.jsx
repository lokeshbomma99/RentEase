import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaPlus, FaTimes } from 'react-icons/fa'

export default function Compare() {
  const { t } = useTheme()
  const [allProperties, setAllProperties] = useState([])
  const [selected, setSelected] = useState([null, null, null])
  const [search, setSearch] = useState(['','',''])

  useEffect(() => {
    api.get('/properties?limit=100').then(res => setAllProperties(res.data.properties))
  }, [])

  const setSlot = (idx, property) => { const u=[...selected]; u[idx]=property; setSelected(u) }
  const clearSlot = (idx) => { const u=[...selected]; u[idx]=null; setSelected(u) }
  const filtered = (idx) => allProperties.filter(p =>
    p.title.toLowerCase().includes(search[idx].toLowerCase()) && !selected.find(s => s?._id === p._id)
  ).slice(0, 5)

  const rows = [
    { label: t('price') || 'Price', key: p => `Rs. ${p.price?.toLocaleString()}/mo` },
    { label: 'Type', key: p => p.type },
    { label: t('address') || 'Location', key: p => `${p.address?.city}, ${p.address?.state}` },
    { label: t('beds'), key: p => p.features?.bedrooms },
    { label: t('baths'), key: p => p.features?.bathrooms },
    { label: 'Area', key: p => p.features?.area ? `${p.features.area} sqft` : 'N/A' },
    { label: t('furnished'), key: p => p.features?.furnished ? '✅' : '❌' },
    { label: t('parking'), key: p => p.features?.parking ? '✅' : '❌' },
    { label: t('petFriendly'), key: p => p.features?.petFriendly ? '✅' : '❌' },
    { label: t('rating'), key: p => p.averageRating > 0 ? `⭐ ${p.averageRating}` : '-' },
    { label: 'Status', key: p => t(p.status) },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('compareProperties')}</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {selected.map((prop, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              {prop ? (
                <div className="relative">
                  <button onClick={() => clearSlot(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"><FaTimes/></button>
                  {prop.images?.[0] && <img src={prop.images[0]} alt="" className="w-full h-28 object-cover rounded-xl mb-2"/>}
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{prop.title}</h3>
                  <p className="text-blue-600 font-bold text-sm">Rs. {prop.price?.toLocaleString()}/mo</p>
                </div>
              ) : (
                <div>
                  <div className="h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center mb-3 text-gray-400"><FaPlus size={24}/></div>
                  <input className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('searchProperty')} value={search[idx]}
                    onChange={e => { const s=[...search]; s[idx]=e.target.value; setSearch(s) }}/>
                  {search[idx] && (
                    <div className="mt-1 border dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700 shadow">
                      {filtered(idx).map(p => (
                        <button key={p._id} onClick={() => { setSlot(idx,p); const s=[...search]; s[idx]=''; setSearch(s) }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-600 dark:text-white border-b dark:border-gray-600 last:border-0">
                          {p.title} — Rs. {p.price?.toLocaleString()}
                        </button>
                      ))}
                      {filtered(idx).length === 0 && <p className="text-center text-gray-400 py-3 text-sm">{t('noResults')}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {selected.filter(Boolean).length >= 2 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-300 font-medium w-1/4">Feature</th>
                  {selected.filter(Boolean).map(p => <th key={p._id} className="text-left px-5 py-3 text-blue-600 font-medium">{p.title}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map(row => (
                  <tr key={row.label} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-5 py-3 font-medium text-gray-600 dark:text-gray-400">{row.label}</td>
                    {selected.filter(Boolean).map(p => <td key={p._id} className="px-5 py-3 text-gray-800 dark:text-white capitalize">{row.key(p)}</td>)}
                  </tr>
                ))}
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Action</td>
                  {selected.filter(Boolean).map(p => (
                    <td key={p._id} className="px-5 py-3">
                      <Link to={`/properties/${p._id}`} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-blue-700">{t('viewDetails')}</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400"><p>{t('selectAtLeast2')}</p></div>
        )}
      </div>
    </div>
  )
}
