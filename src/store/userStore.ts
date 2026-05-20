import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Notification, Coupon } from '../types'
import { currentUser, mockNotifications, mockCoupons } from '../mock/data'

interface UserState {
  currentUser: User
  isLoggedIn: boolean
  notifications: Notification[]
  coupons: Coupon[]
  // 切换用户角色（C端/B端模拟）
  toggleRole: () => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addCoupon: (coupon: Coupon) => void
  useCoupon: (id: string) => void
  getUnreadCount: () => number
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: { ...currentUser },
      isLoggedIn: true,
      notifications: [...mockNotifications],
      coupons: [...mockCoupons],

      toggleRole: () =>
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            role: state.currentUser.role === 'user' ? 'host' : 'user',
          },
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      addCoupon: (coupon) =>
        set((state) => ({ coupons: [...state.coupons, coupon] })),

      useCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isUsed: true, usedAt: new Date().toISOString() } : c
          ),
        })),

      getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,
    }),
    { name: 'user-store' }
  )
)
