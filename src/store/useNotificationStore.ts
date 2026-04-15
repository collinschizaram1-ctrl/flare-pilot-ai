import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Notification } from '../utils/mockData'

interface NotificationState {
  notifications: Notification[]
  addNotification:   (n: Omit<Notification, 'id'>) => void
  markRead:          (id: string) => void
  markAllRead:       () => void
  removeNotification:(id: string) => void
  unreadCount:       () => number
}

let seq = 1000

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (n) => set((s) => ({
        notifications: [{ ...n, id: `notif-${seq++}` }, ...s.notifications].slice(0, 50),
      })),

      markRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),

      markAllRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, read: true })),
      })),

      removeNotification: (id) => set((s) => ({
        notifications: s.notifications.filter(n => n.id !== id),
      })),

      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    { name: 'flarepilot-notifications' }
  )
)
