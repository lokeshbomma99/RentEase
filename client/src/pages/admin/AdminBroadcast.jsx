import { useState } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaPaperPlane } from 'react-icons/fa'

export default function AdminBroadcast() {
  const { t } = useTheme()
  const [form, setForm] = useState({ subject: '', message: '', targetRole: 'all' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!confirm(`Send email to all ${form.targetRole} users?`)) return
    setLoading(true)
    try {
      const res = await api.post('/admin/broadcast-email', form)
      toast.success(res.data.message)
      setForm({ subject: '', message: '', targetRole: 'all' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setLoading(false) }
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <FaPaperPlane className="text-blue-600"/> {t('broadcastEmail')}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sendTo')}</label>
              <select className={inputCls} value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})}>
                <option value="all">{t('allUsers')}</option>
                <option value="user">{t('tenantsOnly')}</option>
                <option value="owner">{t('ownersOnly')}</option>
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('subject')}</label>
              <input required className={inputCls} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder={t('subject') + '...'}/></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('message')}</label>
              <textarea required className={inputCls + ' h-40 resize-none'} value={form.message} onChange={e => setForm({...form, message: e.target.value})}/></div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 text-sm text-yellow-700 dark:text-yellow-400">
              ⚠️ This will send email to ALL selected users.
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
              <FaPaperPlane/> {loading ? t('sending') : t('sendBroadcast')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
