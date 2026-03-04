import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'
import { useAuth } from './AuthContext.jsx'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    if (!user) return
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unreadCount)
    } catch (e) {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [user])

  const markAllRead = async () => {
    await api.put('/notifications/read-all')
    setUnreadCount(0)
    setNotifications(n => n.map(x => ({ ...x, isRead: true })))
  }

  const deleteNotif = async (id) => {
    await api.delete(`/notifications/${id}`)
    setNotifications(n => n.filter(x => x._id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAllRead, deleteNotif }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
