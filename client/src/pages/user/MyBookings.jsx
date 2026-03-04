import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext.jsx'
import { FaDownload, FaTimes } from 'react-icons/fa'

const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red', cancelled: 'gray', completed: 'blue' }

const generateInvoiceHTML = (booking) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}
  .header{background:linear-gradient(135deg,#2563eb,#4f46e5);color:white;padding:30px;border-radius:12px;margin-bottom:30px}
  .section{background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #2563eb}
  .section h3{color:#2563eb;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb}
  .row:last-child{border-bottom:none}
  .label{color:#6b7280;font-size:14px} .value{font-weight:600;font-size:14px}
  .total{display:flex;justify-content:space-between;background:#2563eb;color:white;padding:16px 20px;border-radius:8px;margin-top:20px}
  .footer{text-align:center;color:#9ca3af;font-size:12px;margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb}
</style></head><body>
<div class="header"><h1>🏠 RentEase</h1><p>Invoice #${booking._id?.slice(-8).toUpperCase()}</p></div>
<div class="section"><h3>Booking Details</h3>
  <div class="row"><span class="label">Property</span><span class="value">${booking.property?.title}</span></div>
  <div class="row"><span class="label">Location</span><span class="value">${booking.property?.address?.city}, ${booking.property?.address?.state}</span></div>
  <div class="row"><span class="label">Move-in</span><span class="value">${new Date(booking.startDate).toLocaleDateString('en-IN',{dateStyle:'long'})}</span></div>
  <div class="row"><span class="label">Move-out</span><span class="value">${new Date(booking.endDate).toLocaleDateString('en-IN',{dateStyle:'long'})}</span></div>
  <div class="row"><span class="label">Status</span><span class="value">${booking.status}</span></div>
</div>
<div class="section"><h3>Owner Details</h3>
  <div class="row"><span class="label">Name</span><span class="value">${booking.owner?.name}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${booking.owner?.email}</span></div>
  <div class="row"><span class="label">Phone</span><span class="value">${booking.owner?.phone||'N/A'}</span></div>
</div>
<div class="total"><span>Total Amount</span><span style="font-size:20px;font-weight:bold">Rs. ${booking.totalAmount?.toLocaleString('en-IN')}</span></div>
<div class="footer"><p>Generated on ${new Date().toLocaleDateString('en-IN',{dateStyle:'long'})} | RentEase &copy; ${new Date().getFullYear()}</p></div>
</body></html>`

export default function MyBookings() {
  const { t } = useTheme()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bookings/my-bookings').then(res => setBookings(res.data.bookings)).finally(() => setLoading(false))
  }, [])

  const cancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`)
      setBookings(bookings.map(b => b._id === id ? {...b, status: 'cancelled'} : b))
      toast.success('Booking cancelled')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const downloadInvoice = (booking) => {
    const html = generateInvoiceHTML(booking)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `Invoice-${booking._id?.slice(-8)}.html`; a.click()
    URL.revokeObjectURL(url)
    toast.success('Invoice downloaded!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('myBookingsTitle')}</h1>
        {loading ? (
          <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"/>)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('noBookings')}</div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const c = statusColor[b.status] || 'gray'
              return (
                <div key={b._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex gap-4">
                      {b.property?.images?.[0] && <img src={b.property.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0"/>}
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{b.property?.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{b.property?.address?.city}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}</p>
                        <p className="font-semibold text-blue-600 mt-1">Rs. {b.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-${c}-100 text-${c}-700`}>{t(b.status)}</span>
                      <div className="flex gap-2">
                        {b.status === 'approved' && (
                          <button onClick={() => downloadInvoice(b)} className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600">
                            <FaDownload size={10}/> {t('downloadInvoice')}
                          </button>
                        )}
                        {b.status === 'pending' && (
                          <button onClick={() => cancel(b._id)} className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600">
                            <FaTimes size={10}/> {t('cancelBooking')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {b.rejectionReason && <p className="mt-2 text-red-500 text-sm">Reason: {b.rejectionReason}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
