import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import toast from 'react-hot-toast'
import { FaHome } from 'react-icons/fa'

export default function Register() {
  const { register } = useAuth()
  const { t } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    await register(form)
    toast.success('Registration successful! Please login.')
    navigate('/login')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed')
  } finally {
    setLoading(false)
  }
}

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-blue-600 text-3xl font-bold mb-2">
            <FaHome/> RentEase
          </div>
          <p className="text-gray-500 dark:text-gray-400">{t('createAccount')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fullName')}</label>
              <input required className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
              <input type="email" required className={inputCls} value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input type="password" required className={inputCls} value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')}</label>
              <input className={inputCls} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('iAmA')}</label>
              <select className={inputCls} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="user">{t('tenant')}</option>
                <option value="owner">{t('owner_role')}</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
              {loading ? '...' : t('register')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">{t('login')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
