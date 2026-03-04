import { useState, useRef } from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import api from '../services/api.js'
import toast from 'react-hot-toast'
import { FaCamera, FaUser, FaLock, FaGlobe } from 'react-icons/fa'

export default function ProfilePage() {
  const { user } = useAuth()
  const { darkMode, setDarkMode, language, setLanguage, t } = useTheme()
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const fileRef = useRef()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('phone', form.phone)
      if (avatarFile) formData.append('avatar', avatarFile)
      await api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(t('saveChanges') + ' ✅')
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await api.put('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setLoading(false) }
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('myProfile')}</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6 flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100">
              {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover"/> :
                <div className="w-full h-full flex items-center justify-center text-blue-600 text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</div>}
            </div>
            <button onClick={() => fileRef.current.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-blue-700 shadow">
              <FaCamera size={11}/>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full capitalize">{user?.role}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {[['profile', t('personalInfo'), <FaUser/>], ['password', t('changePassword'), <FaLock/>], ['preferences', t('preferences'), <FaGlobe/>]].map(([id, label, icon]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
              {icon} <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t('personalInfo')}</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fullName')}</label>
                <input className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailCannotChange')}</label>
                <input className={inputCls + ' opacity-60 cursor-not-allowed'} value={user?.email} disabled/></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')}</label>
                <input className={inputCls} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210"/></div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
                {loading ? '...' : t('saveChanges')}
              </button>
            </form>
          </div>
        )}

        {tab === 'password' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t('changePassword')}</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[[t('currentPassword'),'currentPassword'],[t('newPassword'),'newPassword'],[t('confirmPassword'),'confirm']].map(([label, key]) => (
                <div key={key}><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input type="password" className={inputCls} value={pwForm[key]} onChange={e => setPwForm({...pwForm, [key]: e.target.value})} required/></div>
              ))}
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
                {loading ? '...' : t('changePassword')}
              </button>
            </form>
          </div>
        )}

        {tab === 'preferences' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-3">
            <h3 className="font-bold text-gray-800 dark:text-white">{t('preferences')}</h3>
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{t('darkModeLabel')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('darkModeDesc')}</p>
              </div>
              <button onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0.5'}`}/>
              </button>
            </div> */}
            <div>
              <p className="font-medium text-gray-800 dark:text-white mb-2">{t('languageLabel')}</p>
              <div className="flex gap-3">
                {[['en','English'],['gu','ગુજરાતી'],['hi','हिंदी']].map(([code, label]) => (
                  <button key={code} onClick={() => setLanguage(code)}
                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${language === code ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
