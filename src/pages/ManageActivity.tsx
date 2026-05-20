import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ActivityCard } from '../components/ActivityCard'
import { ConfirmDialog } from '../components/Modal'
import { useActivityStore } from '../store/activityStore'
import { useUserStore } from '../store/userStore'
import { useToast } from '../components/Toast'
import { getStatusText, getStatusColor } from '../utils'

export default function ManageActivity() {
  const navigate = useNavigate()
  const { currentUser } = useUserStore()
  const { activities, cancelActivity } = useActivityStore()
  const { show } = useToast()
  const [tab, setTab] = useState<string>('all')
  const [cancelId, setCancelId] = useState<string | null>(null)

  const myActivities = activities.filter((a) => a.hostId === currentUser.id)

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'published', label: '已发布' },
    { key: 'confirmed', label: '已成行' },
    { key: 'ended', label: '已结束' },
    { key: 'cancelled', label: '已取消' },
  ]

  const filtered = tab === 'all' ? myActivities : myActivities.filter((a) => a.status === tab)

  const handleCancel = () => {
    if (cancelId) {
      cancelActivity(cancelId)
      show('活动已取消，退款将自动处理', 'success')
      setCancelId(null)
    }
  }

  return (
    <Layout title="活动管理">
      {/* 发布按钮 */}
      <div className="px-4 pt-3 pb-2 flex justify-end">
        <button
          onClick={() => navigate('/host/publish')}
          className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-indigo-500 active:bg-indigo-600"
        >
          + 发布新活动
        </button>
      </div>

      {/* Tab */}
      <div className="flex overflow-x-auto bg-white border-b border-gray-100 px-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors relative ${
              tab === t.key ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div className="px-4 pt-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm text-gray-400 mb-4">还没有发布活动</p>
            <button
              onClick={() => navigate('/host/publish')}
              className="px-5 py-2 rounded-full text-sm font-medium text-indigo-600 bg-indigo-50"
            >
              发布第一个活动
            </button>
          </div>
        ) : (
          filtered.map((activity) => (
            <div key={activity.id} className="mb-3">
              <ActivityCard activity={activity} showStatus />
              {/* 管理操作 */}
              {(activity.status === 'published' || activity.status === 'confirmed') && (
                <div className="flex gap-2 mt-1 px-1">
                  <button
                    onClick={() => navigate(`/activity/${activity.id}`)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 active:bg-gray-100"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => setCancelId(activity.id)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 active:bg-red-100"
                  >
                    取消活动
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        visible={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="确认取消活动"
        danger
        confirmText="确认取消"
        content={
          <div className="space-y-2">
            <p>取消活动后将执行以下操作：</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>全额退还所有已支付用户的留位费</li>
              <li>解冻所有用户的尾款预授权</li>
              <li>自动为所有受影响用户发放5元无门槛补偿券</li>
            </ul>
            <p className="text-red-500 text-xs mt-2">
              注：月度取消次数过多将触发发布限制
            </p>
          </div>
        }
      />
    </Layout>
  )
}
