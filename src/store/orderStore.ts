import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Registration } from '../types'
import { mockRegistrations } from '../mock/data'

interface OrderState {
  registrations: Registration[]
  addRegistration: (reg: Registration) => void
  updateRegistration: (id: string, updates: Partial<Registration>) => void
  cancelRegistration: (id: string, reason?: string) => void
  payDeposit: (id: string) => void
  authorizeBalance: (id: string) => void
  getByUser: (userId: string) => Registration[]
  getByActivity: (activityId: string) => Registration[]
  getByUserAndActivity: (userId: string, activityId: string) => Registration | undefined
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      registrations: [...mockRegistrations],

      addRegistration: (reg) =>
        set((state) => ({ registrations: [reg, ...state.registrations] })),

      updateRegistration: (id, updates) =>
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      cancelRegistration: (id, reason) =>
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'cancelled' as const,
                  cancelledAt: new Date().toISOString(),
                  cancelReason: reason,
                  // 根据规则：留位费退款，尾款解冻
                  paymentStatus: r.depositAmount > 0 ? 'refunded' as const : 'unfrozen' as const,
                }
              : r
          ),
        })),

      payDeposit: (id) =>
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'registered' as const,
                  paymentStatus: 'deposit_paid' as const,
                  paidAt: new Date().toISOString(),
                }
              : r
          ),
        })),

      authorizeBalance: (id) =>
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  paymentStatus: 'authorized' as const,
                  authorizedAt: new Date().toISOString(),
                }
              : r
          ),
        })),

      getByUser: (userId) => get().registrations.filter((r) => r.userId === userId),

      getByActivity: (activityId) =>
        get().registrations.filter((r) => r.activityId === activityId),

      getByUserAndActivity: (userId, activityId) =>
        get().registrations.find(
          (r) => r.userId === userId && r.activityId === activityId
        ),
    }),
    { name: 'order-store' }
  )
)
