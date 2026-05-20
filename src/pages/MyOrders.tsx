import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RegistrationStatus } from '../types'
import { Layout } from '../components/Layout'
import { EmptyState } from '../components/EmptyState'
import { useUserStore } from '../store/userStore'
import { useOrderStore } from '../store/orderStore'
import { useActivityStore } from '../store/activityStore'
import { getUserById, getActivityById } from '../mock/data'
import { formatDate, getStatusText, getStatusColor, formatAmount } from '../utils'

type TabKey = 'all' | RegistrationStatus

interface Tab {
  key: TabKey
  label: string
}

const tabs: Tab[] = [
  { key: 'all', label: '全部' },
  { key: 'pending_approval', label: '待审批' },
  { key: 'pending_payment', label: '待支付' },
  { key: 'registered', label: '已报名' },
  { key: 'cancelled', label: '已取消' },
  { key: 'ended', label: '已结束' },
]

export default function MyOrders() {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)
  const getByUser = useOrderStore((s) => s.getByUser)
  const activities = useActivityStore((s) => s.activities)

  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const allRegistrations = useMemo(
    () => getByUser(currentUser.id),
    [getByUser, currentUser.id, activities]
  )

  const filteredRegistrations = useMemo(() => {
    if (activeTab === 'all') return allRegistrations
    return allRegistrations.filter((r) => r.status === activeTab)
  }, [allRegistrations, activeTab])

  const totalCount = allRegistrations.length

  return (
    <Layout title="我的报名" showBack>
      {/* Tab filter */}
      <div className="sticky top-12 z-20 bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto scrollbar-hide px-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Registration list */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          title="暂无报名"
          description={activeTab === 'all' ? '还没有报名任何活动，去看看有什么有趣的活动吧' : '该状态下没有报名记录'}
          actionText="去看看活动"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredRegistrations.map((reg) => {
            const activity = getActivityById(reg.activityId)
            if (!activity) return null

            const statusColor = getStatusColor(reg.status)
            const statusText = getStatusText(reg.status)

            return (
              <button
                key={reg.id}
                onClick={() => navigate(`/order/${reg.id}`)}
                className="w-full text-left bg-white px-4 py-3 active:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Cover thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={activity.cover}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.startTime)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {statusText}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatAmount(reg.depositAmount + reg.balanceAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 flex items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-gray-300"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
