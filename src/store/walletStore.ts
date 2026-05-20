import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Wallet, WalletTransaction, Review } from '../types'
import { mockWallet, mockWalletTransactions, mockReviews } from '../mock/data'

interface WalletState {
  wallet: Wallet
  transactions: WalletTransaction[]
  reviews: Review[]
  withdraw: (amount: number) => boolean
  addTransaction: (tx: WalletTransaction) => void
  addReview: (review: Review) => void
  deleteReview: (id: string) => void
  getReviewsForUser: (userId: string) => Review[]
  getReviewsForActivity: (activityId: string) => Review[]
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallet: { ...mockWallet },
      transactions: [...mockWalletTransactions],
      reviews: [...mockReviews],

      withdraw: (amount) => {
        const { wallet } = get()
        if (amount > wallet.available) return false
        set({
          wallet: { ...wallet, available: wallet.available - amount },
          transactions: [
            {
              id: `wt_${Date.now()}`,
              hostId: wallet.hostId,
              type: 'withdraw',
              amount: -amount,
              description: `提现 ¥${amount}`,
              createdAt: new Date().toISOString(),
            },
            ...get().transactions,
          ],
        })
        return true
      },

      addTransaction: (tx) =>
        set((state) => ({ transactions: [tx, ...state.transactions] })),

      addReview: (review) =>
        set((state) => ({ reviews: [review, ...state.reviews] })),

      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),

      getReviewsForUser: (userId) =>
        get().reviews.filter((r) => r.toUserId === userId),

      getReviewsForActivity: (activityId) =>
        get().reviews.filter((r) => r.activityId === activityId),
    }),
    { name: 'wallet-store' }
  )
)
