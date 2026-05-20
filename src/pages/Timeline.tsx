import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useUserStore } from '../store/userStore'
import { useOrderStore } from '../store/orderStore'
import { useActivityStore } from '../store/activityStore'
import { getActivityById, mockBadges } from '../mock/data'
import { formatDate, getStatusText, getStatusColor } from '../utils'
import type { Badge } from '../types'

interface TimelineItem {
  id: string
  activityId: string
  title: string
  date: string
  role: '参与者' | '主办方'
  status: string
}

interface MonthGroup {
  label: string
  items: TimelineItem[]
}

export function Timeline() {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)
  const registrations = useOrderStore((s) => s.registrations)
  const activities = useActivityStore((s) => s.activities)

  // Get earned badges
  const earnedBadges = useMemo(
    () => mockBadges.filter((b) => b.earnedAt),
    []
  )

  // Build timeline items: participated + hosted activities
  const timelineData = useMemo(() => {
    const items: TimelineItem[] = []
    const seen = new Set<string>()

    // Activities user participated in
    registrations
      .filter((r) => r.userId === currentUser.id && r.status !== 'cancelled')
      .forEach((reg) => {
        const activity = getActivityById(reg.activityId)
        if (activity && !seen.has(activity.id)) {
          seen.add(activity.id)
          items.push({
            id: `join_${activity.id}`,
            activityId: activity.id,
            title: activity.title,
            date: activity.startTime,
            role: '参与者',
            status: activity.status,
          })
        }
      })

    // Activities user hosted
    activities
      .filter((a) => a.hostId === currentUser.id)
      .forEach((activity) => {
        if (!seen.has(activity.id)) {
          seen.add(activity.id)
          items.push({
            id: `host_${activity.id}`,
            activityId: activity.id,
            title: activity.title,
            date: activity.startTime,
            role: '主办方',
            status: activity.status,
          })
        }
      })

    // Sort by date descending
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Group by month
    const groups: MonthGroup[] = []
    const groupMap = new Map<string, TimelineItem[]>()

    items.forEach((item) => {
      const d = new Date(item.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const label = `${d.getFullYear()}年${d.getMonth() + 1}月`
      if (!groupMap.has(key)) {
        groupMap.set(key, [])
        groups.push({ label, items: groupMap.get(key)! })
      }
      groupMap.get(key)!.push(item)
    })

    const joinedCount = items.filter((i) => i.role === '参与者').length
    const hostedCount = items.filter((i) => i.role === '主办方').length

    return { groups, joinedCount, hostedCount }
  }, [currentUser.id, registrations, activities])

  return (
    <Layout title="活动生涯" showBack>
      {/* Badges Section */}
      <div className="bg-white px-4 pt-4 pb-3 mb-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">获得的徽章</h2>
        {earnedBadges.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center min-w-[64px] bg-gradient-to-b from-amber-50 to-white rounded-2xl p-3 border border-amber-100"
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">还没有获得徽章，快去参加活动吧</p>
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-white px-4 py-3 mb-2">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <span className="text-lg font-bold text-indigo-600">{timelineData.joinedCount}</span>
            <span className="text-xs text-gray-500 ml-1">参与</span>
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <div className="text-center">
            <span className="text-lg font-bold text-orange-500">{timelineData.hostedCount}</span>
            <span className="text-xs text-gray-500 ml-1">举办</span>
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <div className="text-center">
            <span className="text-lg font-bold text-amber-500">{earnedBadges.length}</span>
            <span className="text-xs text-gray-500 ml-1">徽章</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-2">
        {timelineData.groups.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm">还没有活动记录</p>
          </div>
        ) : (
          timelineData.groups.map((group) => (
            <div key={group.label} className="mb-6">
              <h3 className="text-sm font-bold text-gray-600 mb-3 sticky top-12 bg-gray-50 py-1 z-10">
                {group.label}
              </h3>
              <div className="relative ml-3 border-l-2 border-gray-100 pl-5 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/activity/${item.activityId}`)}
                    className="relative bg-white rounded-xl p-3 shadow-sm active:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[26px] top-4 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-300" />

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            item.role === '主办方'
                              ? 'bg-orange-50 text-orange-500'
                              : 'bg-indigo-50 text-indigo-500'
                          }`}
                        >
                          {item.role}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  )
}
export default Timeline
