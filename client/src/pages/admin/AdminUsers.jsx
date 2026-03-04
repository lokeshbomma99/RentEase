import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function AdminUsers() {
  const { t } = useTheme()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data.users)).finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle-status`)
      setUsers(users.map(u => u._id === id ? {...u, isActive: !u.isActive} : u))
      toast.success(res.data.message)
    } catch { toast.error('Failed') }
  }

  const roleColor = { admin: 'purple', owner: 'blue', user: 'green' }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('manageUsers')}</h1>
        {loading ? (
          <div className="animate-pulse space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"/>)}</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  <th className="px-5 py-3 text-gray-600 dark:text-gray-300 font-medium">{t('name')}</th>
                  <th className="px-5 py-3 text-gray-600 dark:text-gray-300 font-medium">{t('email')}</th>
                  <th className="px-5 py-3 text-gray-600 dark:text-gray-300 font-medium">{t('role')}</th>
                  <th className="px-5 py-3 text-gray-600 dark:text-gray-300 font-medium">{t('status')}</th>
                  <th className="px-5 py-3 text-gray-600 dark:text-gray-300 font-medium">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map(u => {
                  const rc = roleColor[u.role] || 'gray'
                  return (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                            {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" alt=""/> : u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs bg-${rc}-100 text-${rc}-700 capitalize`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? t('available') : t('inactive')}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {u.role !== 'admin' && (
                          <button onClick={() => toggleStatus(u._id)}
                            className={`text-xs px-3 py-1 rounded-lg ${u.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                            {u.isActive ? t('deactivate') : t('activate')}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
