import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ConfirmDialog } from '../components/Modal'
import { useToast } from '../components/Toast'
import { useOrderStore } from '../store/orderStore'
import { useActivityStore } from '../store/activityStore'
import { getActivityById, getUserById } from '../mock/data'
import {
  formatDate,
  getPaymentStatusText,
  hoursUntilActivity,
  formatAmount,
} from '../utils'

export default function OrderDetail() {
  const { regId } = useParams<{ regId: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const registrations = useOrderStore((s) => s.registrations)
  const cancelRegistration = useOrderStore((s) => s.cancelRegistration)

  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const registration = useMemo(
    () => registrations.find((r) => r.id === regId),
    [registrations, regId]
  )

  if (!registration) {
    return (
      <Layout title="订单详情" showBack>
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">订单不存在</h3>
          <p className="text-sm text-gray-400 mb-5">该订单可能已被删除</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="px-6 py-2 rounded-full text-sm font-medium text-indigo-600 bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            返回我的报名
          </button>
        </div>
      </Layout>
    )
  }

  const activity = getActivityById(registration.activityId)
  const host = activity ? getUserById(activity.hostId) : undefined

  if (!activity) {
    return (
      <Layout title="订单详情" showBack>
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">活动信息丢失</h3>
          <button
            onClick={() => navigate('/my-orders')}
            className="px-6 py-2 rounded-full text-sm font-medium text-indigo-600 bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            返回我的报名
          </button>
        </div>
      </Layout>
    )
  }

  const hoursLeft = hoursUntilActivity(activity.startTime)
  const isMoreThan24h = hoursLeft >= 24
  const totalAmount = registration.depositAmount + registration.balanceAmount
  const isCancelled = registration.status === 'cancelled'
  const canCancel =
    !isCancelled &&
    registration.status !== 'ended' &&
    registration.status !== 'rejected'

  const handleCancel = () => {
    cancelRegistration(registration.id, isMoreThan24h ? '用户主动取消' : '用户主动取消（24小时内）')
    toast.show('已取消报名', 'success')
    setShowCancelDialog(false)
  }

  return (
    <Layout title="订单详情" showBack>
      {/* Activity info card */}
      <div className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative h-40 bg-gray-100">
          <img
            src={activity.cover}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          {isCancelled && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">已取消</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-base font-semibold text-gray-800 leading-snug">
            {activity.title}
          </h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-gray-400 flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-sm text-gray-600">
                {formatDate(activity.startTime)}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-gray-400 flex-shrink-0 mt-0.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm text-gray-600">
                {activity.location} · {activity.locationDetail}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Host info */}
      {host && (
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={host.avatar}
              alt={host.nickname}
              className="w-10 h-10 rounded-full bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{host.nickname}</p>
              <p className="text-xs text-gray-400">
                评分 {host.rating} · 已举办 {host.hostedCount} 场
              </p>
            </div>
            <span className="text-xs text-gray-400">主办方</span>
          </div>
        </div>
      )}

      {/* Payment status section */}
      <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">支付信息</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">总费用</span>
            <span className="text-sm font-medium text-gray-800">
              {formatAmount(totalAmount)}
            </span>
          </div>
          {registration.depositAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">留位费</span>
              <span className="text-sm text-gray-700">
                {formatAmount(registration.depositAmount)}
              </span>
            </div>
          )}
          {registration.balanceAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">尾款</span>
              <span className="text-sm text-gray-700">
                {formatAmount(registration.balanceAmount)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
            <span className="text-sm text-gray-500">支付状态</span>
            <span className="text-sm font-medium text-gray-800">
              {getPaymentStatusText(registration.paymentStatus)}
            </span>
          </div>
        </div>

        {/* Balance auto-deduct note */}
        {registration.paymentStatus === 'deposit_paid' &&
          registration.balanceAmount > 0 && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl">
              <div className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-amber-500 flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  尾款将在活动结束后自动扣款
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Cancel button */}
      {canCancel && (
        <div className="mx-4 mt-3 mb-6">
          <button
            onClick={() => setShowCancelDialog(true)}
            className="w-full py-3 rounded-2xl text-sm font-medium text-red-500 bg-white border border-red-200 active:bg-red-50 transition-colors shadow-sm"
          >
            取消报名
          </button>
        </div>
      )}

      {/* Cancel confirmation dialog */}
      <ConfirmDialog
        visible={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="确认取消报名"
        content={
          isMoreThan24h ? (
            <p>取消后留位费将全额退款，尾款预授权立即解冻</p>
          ) : (
            <p>取消后留位费不予退还，尾款预授权将解冻</p>
          )
        }
        confirmText="确认取消"
        danger
      />
    </Layout>
  )
}
