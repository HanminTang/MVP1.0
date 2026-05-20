import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { EmptyState } from '../components/EmptyState'
import { useUserStore } from '../store/userStore'
import { timeAgo } from '../utils'

export function Messages() {
  const navigate = useNavigate()
  const { notifications, markNotificationRead, markAllNotificationsRead, getUnreadCount } = useUserStore()
  const unreadCount = getUnreadCount()

  const getTypeIcon = (type: string): string => {
    const map: Record<string, string> = {
      registration: '📋',
      payment: '💳',
      activity_change: '📢',
      refund: '💰',
      review: '⭐',
      system: '🔔',
    }
    return map[type] || '🔔'
  }

  const getTypeLabel = (type: string): string => {
    const map: Record<string, string> = {
      registration: '报名',
      payment: '支付',
      activity_change: '活动变更',
      refund: '退款',
      review: '评价',
      system: '系统',
    }
    return map[type] || '通知'
  }

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const unreadList = sorted.filter((n) => !n.isRead)
  const readList = sorted.filter((n) => n.isRead)

  const renderNotificationItem = (noti: typeof notifications[0]) => (
    <button
      key={noti.id}
      onClick={() => {
        markNotificationRead(noti.id)
        if (noti.linkTo) navigate(noti.linkTo)
      }}
      className={`w-full text-left px-4 py-3.5 flex gap-3 border-b border-gray-50 active:bg-gray-50 transition-colors ${
        !noti.isRead ? 'bg-indigo-50/40' : ''
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
          !noti.isRead ? 'bg-indigo-100' : 'bg-gray-100'
        }`}
      >
        {getTypeIcon(noti.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-sm ${
              !noti.isRead ? 'font-semibold text-gray-800' : 'font-medium text-gray-600'
            }`}
          >
            {noti.title}
          </span>
          {!noti.isRead && (
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{noti.content}</p>
        <span className="text-[10px] text-gray-300 mt-1 block">{timeAgo(noti.createdAt)}</span>
      </div>

      {/* Arrow for those with links */}
      {noti.linkTo && (
        <svg
          className="w-4 h-4 text-gray-300 self-center shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  )

  return (
    <Layout title="消息通知" showBack>
      {/* Mark all read */}
      {unreadCount > 0 && (
        <div className="flex justify-end px-4 py-2 bg-white border-b border-gray-100">
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-indigo-500 font-medium active:text-indigo-700"
          >
            全部已读
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="暂无消息"
          description="活动相关的通知会在这里显示"
          actionText="去逛逛"
          onAction={() => navigate('/')}
        />
      ) : (
        <div>
          {/* Unread Section */}
          {unreadList.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50">
                <span className="text-xs font-medium text-gray-500">
                  未读 ({unreadList.length})
                </span>
              </div>
              <div className="bg-white">{unreadList.map(renderNotificationItem)}</div>
            </div>
          )}

          {/* Read Section */}
          {readList.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50">
                <span className="text-xs font-medium text-gray-500">已读</span>
              </div>
              <div className="bg-white">{readList.map(renderNotificationItem)}</div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
export default Messages
