import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Activity, QA } from '../types'
import { mockActivities } from '../mock/data'

interface ActivityState {
  activities: Activity[]
  favorites: string[] // 收藏的活动ID
  toggleFavorite: (activityId: string) => void
  isFavorite: (activityId: string) => boolean
  addActivity: (activity: Activity) => void
  updateActivity: (id: string, updates: Partial<Activity>) => void
  cancelActivity: (id: string) => void
  addParticipant: (activityId: string, userId: string) => void
  removeParticipant: (activityId: string, userId: string) => void
  approveParticipant: (activityId: string, userId: string) => void
  addQuestion: (activityId: string, qa: QA) => void
  answerQuestion: (activityId: string, qaId: string, answer: string) => void
  toggleHighlightQuestion: (activityId: string, qaId: string) => void
  setGroupQrCode: (activityId: string, qrCode: string) => void
  getActivitiesByHost: (hostId: string) => Activity[]
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [...mockActivities],
      favorites: [],

      toggleFavorite: (activityId) =>
        set((state) => ({
          favorites: state.favorites.includes(activityId)
            ? state.favorites.filter((id) => id !== activityId)
            : [...state.favorites, activityId],
        })),

      isFavorite: (activityId) => get().favorites.includes(activityId),

      addActivity: (activity) =>
        set((state) => ({ activities: [activity, ...state.activities] })),

      updateActivity: (id, updates) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      cancelActivity: (id) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, status: 'cancelled' } : a
          ),
        })),

      addParticipant: (activityId, userId) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  participantIds: [...a.participantIds, userId],
                  currentParticipants: a.currentParticipants + 1,
                }
              : a
          ),
        })),

      removeParticipant: (activityId, userId) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  participantIds: a.participantIds.filter((id) => id !== userId),
                  currentParticipants: Math.max(0, a.currentParticipants - 1),
                }
              : a
          ),
        })),

      approveParticipant: (activityId, userId) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  pendingIds: a.pendingIds.filter((id) => id !== userId),
                  participantIds: [...a.participantIds, userId],
                  currentParticipants: a.currentParticipants + 1,
                }
              : a
          ),
        })),

      addQuestion: (activityId, qa) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? { ...a, questions: [...a.questions, qa] }
              : a
          ),
        })),

      answerQuestion: (activityId, qaId, answer) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  questions: a.questions.map((q) =>
                    q.id === qaId ? { ...q, answer } : q
                  ),
                }
              : a
          ),
        })),

      toggleHighlightQuestion: (activityId, qaId) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  questions: a.questions.map((q) =>
                    q.id === qaId ? { ...q, isHighlighted: !q.isHighlighted } : q
                  ),
                }
              : a
          ),
        })),

      setGroupQrCode: (activityId, qrCode) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId ? { ...a, groupQrCode: qrCode } : a
          ),
        })),

      getActivitiesByHost: (hostId) =>
        get().activities.filter((a) => a.hostId === hostId),
    }),
    { name: 'activity-store' }
  )
)
