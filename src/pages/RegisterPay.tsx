import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ConfirmDialog } from '../components/Modal'
import { useActivityStore } from '../store/activityStore'
import { useOrderStore } from '../store/orderStore'
import { useUserStore } from '../store/userStore'
import { generateId, formatAmount } from '../utils'
import { useToast } from '../components/Toast'
import { getActivityById } from '../mock/data'
import type { Registration } from '../types'

type Step = 1 | 2

export function RegisterPay() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { addParticipant, activities } = useActivityStore()
  const { addRegistration } = useOrderStore()
  const { currentUser } = useUserStore()

  const [step, setStep] = useState<Step>(1)
  const [paying, setPaying] = useState(false)
  const [accessError, setAccessError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // Get the latest activity data from store (in case of updates)
  const activity = activities.find((a) => a.id === id) || getActivityById(id || '')

  useEffect(() => {
    if (!activity) return

    const errors: string[] = []
    const { accessRules } = activity

    // Check age limits
    if (accessRules.minAge && currentUser.age < accessRules.minAge) {
      errors.push(`年龄不满足要求（最低 ${accessRules.minAge} 岁）`)
    }
    if (accessRules.maxAge && currentUser.age > accessRules.maxAge) {
      errors.push(`年龄不满足要求（最高 ${accessRules.maxAge} 岁）`)
    }

    // Check gender limit
    if (accessRules.genderLimit && accessRules.genderLimit !== 'all') {
      if (currentUser.gender !== accessRules.genderLimit) {
        const genderText = accessRules.genderLimit === 'male' ? '限男性' : '限女性'
        errors.push(`性别不满足要求（${genderText}）`)
      }
    }

    // Check availability
    if (activity.currentParticipants >= accessRules.maxParticipants) {
      errors.push('活动名额已满')
    }

    // Check if already registered
    const { getByUserAndActivity } = useOrderStore.getState()
    const existing = getByUserAndActivity(currentUser.id, activity.id)
    if (existing && existing.status !== 'cancelled') {
      errors.push('你已报名此活动')
    }

    setAccessError(errors.length > 0 ? errors.join('；') : null)
  }, [activity, currentUser])

  if (!activity) {
    return (
      <Layout title="报名" showBack>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">活动不存在</p>
        </div>
      </Layout>
    )
  }

  const isFree = activity.fee.type === 'free'
  const isApproval = activity.accessRules.joinMethod === 'approval'

  const handleConfirmRegistration = () => {
    if (accessError) return

    if (isFree) {
      // Free activities skip payment
      createRegistrationAndNavigate()
    } else {
      setStep(2)
    }
  }

  const handlePayment = () => {
    setPaying(true)

    setTimeout(() => {
      setPaying(false)
      toast.show('支付成功！', 'success')
      createRegistrationAndNavigate()
    }, 1500)
  }

  const createRegistrationAndNavigate = () => {
    const now = new Date().toISOString()
    const regId = generateId('reg')

    const registration: Registration = {
      id: regId,
      activityId: activity.id,
      userId: currentUser.id,
      status: isApproval ? 'pending_approval' : 'registered',
      paymentStatus: isFree
        ? 'fully_paid'
        : activity.fee.type === 'full'
        ? 'fully_paid'
        : 'deposit_paid',
      depositAmount: activity.fee.depositAmount,
      balanceAmount: activity.fee.balanceAmount,
      paidAt: isFree ? undefined : now,
      createdAt: now,
    }

    addRegistration(registration)
    addParticipant(activity.id, currentUser.id)

    setTimeout(() => {
      navigate(`/order/${regId}`)
    }, 500)
  }

  return (
    <Layout title="报名支付" showBack hideTabBar>
      {/* Step Indicator */}
      <div className="bg-white px-4 py-3 flex items-center justify-center gap-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            1
          </div>
          <span className={`text-sm ${step >= 1 ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
            确认报名信息
          </span>
        </div>
        <div className={`w-8 h-px ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`} />
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            2
          </div>
          <span className={`text-sm ${step >= 2 ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
            支付/预授权
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="p-4 space-y-4">
          {/* Activity Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-2">{activity.title}</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{new Date(activity.startTime).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{activity.location} · {activity.locationDetail}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span>{activity.currentParticipants}/{activity.accessRules.maxParticipants} 人已报名</span>
              </div>
            </div>
          </div>

          {/* Access Rules Check */}
          {accessError ? (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">无法报名</p>
                  <p className="text-sm text-red-600">{accessError}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="text-sm font-medium text-green-700">报名条件满足</p>
              </div>
            </div>
          )}

          {/* Approval Note */}
          {isApproval && !accessError && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">需要主办方审批</p>
                  <p className="text-xs text-amber-600">此活动需要主办方审核通过后才能参加，支付后请耐心等待审批结果。</p>
                </div>
              </div>
            </div>
          )}

          {/* Fee Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">费用信息</h3>
            {isFree ? (
              <p className="text-lg font-semibold text-green-600">免费活动</p>
            ) : activity.fee.type === 'full' ? (
              <p className="text-lg font-semibold text-gray-800">
                全款 {formatAmount(activity.fee.totalAmount)}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">留位费</span>
                  <span className="text-base font-semibold text-gray-800">{formatAmount(activity.fee.depositAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">尾款（预授权冻结）</span>
                  <span className="text-base font-semibold text-gray-800">{formatAmount(activity.fee.balanceAmount)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">合计</span>
                  <span className="text-lg font-bold text-indigo-600">{formatAmount(activity.fee.totalAmount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {isFree ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!!accessError}
              className="w-full py-3.5 rounded-2xl text-base font-semibold text-white bg-indigo-500 active:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              确认报名
            </button>
          ) : (
            <button
              onClick={handleConfirmRegistration}
              disabled={!!accessError}
              className="w-full py-3.5 rounded-2xl text-base font-semibold text-white bg-indigo-500 active:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              下一步：支付
            </button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="p-4 space-y-4">
          {/* Fee Breakdown */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">费用明细</h3>
            <div className="space-y-3">
              {activity.fee.type === 'full' ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">全款（实付）</span>
                  <span className="text-xl font-bold text-gray-800">{formatAmount(activity.fee.totalAmount)}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">留位费（实付）</span>
                    <span className="text-xl font-bold text-gray-800">{formatAmount(activity.fee.depositAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">尾款（预授权冻结）</span>
                    <span className="text-xl font-bold text-gray-800">{formatAmount(activity.fee.balanceAmount)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">合计</span>
                    <span className="text-xl font-bold text-indigo-600">{formatAmount(activity.fee.totalAmount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Rule Notes */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
            {activity.fee.type !== 'full' && activity.fee.depositAmount > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5 text-xs">●</span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  留位费进入平台托管，活动结束后结算给主办方
                </p>
              </div>
            )}
            {activity.fee.balanceAmount > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5 text-xs">●</span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  尾款将在活动结束后自动扣款，如取消则立即解冻
                </p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5 text-xs">●</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                活动开始前48小时取消可全额退款
              </p>
            </div>
          </div>

          {/* Back / Pay Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 rounded-2xl text-sm font-medium text-gray-600 bg-gray-100 active:bg-gray-200 transition-colors"
            >
              返回
            </button>
            <button
              onClick={handlePayment}
              disabled={paying}
              className="flex-[2] py-3.5 rounded-2xl text-base font-semibold text-white bg-indigo-500 active:bg-indigo-600 disabled:bg-indigo-300 transition-colors flex items-center justify-center gap-2"
            >
              {paying ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  支付处理中...
                </>
              ) : (
                `模拟支付 ${formatAmount(activity.fee.totalAmount)}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Free Activity Confirm Dialog */}
      <ConfirmDialog
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={createRegistrationAndNavigate}
        title="确认报名"
        content={
          <p>
            确认报名参加「{activity.title}」？
            {isApproval && ' 需要主办方审批通过后才能参加。'}
          </p>
        }
        confirmText="确认报名"
      />
    </Layout>
  )
}
export default RegisterPay
