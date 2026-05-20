import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Activity, QA } from '../types'
import { useActivityStore } from '../store/activityStore'
import { useUserStore } from '../store/userStore'
import { useOrderStore } from '../store/orderStore'
import { getUserById } from '../mock/data'
import { formatDate, formatAmount, getStatusText, getStatusColor, isBeforeNow, getFeeTypeText } from '../utils'
import { Layout } from '../components/Layout'
import { EmptyState } from '../components/EmptyState'

// ─── Helper: render fee button text ──────────────────────────────────────────
function getFeeButtonText(fee: Activity['fee']): string {
  switch (fee.type) {
    case 'free':
      return '免费报名'
    case 'full':
      return `¥${fee.totalAmount} 立即报名`
    case 'deposit':
      return `留位费 ¥${fee.depositAmount} + 尾款 ¥${fee.balanceAmount} 预授权`
    default:
      return '立即报名'
  }
}

export function ActivityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const activities = useActivityStore((s) => s.activities)
  const { toggleFavorite, isFavorite } = useActivityStore()
  const currentUser = useUserStore((s) => s.currentUser)
  const { getByUserAndActivity, addRegistration } = useOrderStore()

  const activity = activities.find((a) => a.id === id)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [newQuestion, setNewQuestion] = useState('')
  const [showAllImages, setShowAllImages] = useState(false)

  // Check registration
  const registration = getByUserAndActivity(currentUser.id, id ?? '')
  const isRegistered =
    registration &&
    registration.status !== 'cancelled' &&
    registration.status !== 'rejected'

  // Favorite
  const isFav = id ? isFavorite(id) : false

  // Derived state
  const host = activity ? getUserById(activity.hostId) : undefined
  const coHosts = activity?.coHostIds.map((cid) => getUserById(cid)).filter(Boolean) ?? []
  const participants =
    activity?.participantIds.map((pid) => getUserById(pid)).filter(Boolean) ?? []

  const isEnded = activity?.status === 'ended'
  const isCancelled = activity?.status === 'cancelled'
  const isFinished = isEnded || isCancelled
  const isFull =
    activity != null &&
    activity.currentParticipants >= activity.accessRules.maxParticipants
  const isStarted = activity ? isBeforeNow(activity.startTime) : false

  // Split Q&A into highlighted and regular
  const { highlightedQAs, regularQAs } = useMemo(() => {
    if (!activity) return { highlightedQAs: [], regularQAs: [] as QA[] }
    const highlighted: QA[] = []
    const regular: QA[] = []
    for (const qa of activity.questions) {
      if (qa.isHighlighted) highlighted.push(qa)
      else regular.push(qa)
    }
    return { highlightedQAs: highlighted, regularQAs: regular }
  }, [activity?.questions])

  // ─── Not found ─────────────────────────────────────────────────────────────
  if (!activity) {
    return (
      <Layout showBack title="活动详情">
        <div className="flex items-center justify-center h-[60vh]">
          <EmptyState title="活动不存在" description="该活动可能已被删除" />
        </div>
      </Layout>
    )
  }

  const images = activity.images.length > 0 ? activity.images : [activity.cover]

  // ─── Button state ──────────────────────────────────────────────────────────
  function getButtonInfo() {
    if (isCancelled) return { text: '活动已取消', disabled: true, className: 'bg-gray-300 text-gray-500 cursor-not-allowed' }
    if (isEnded) return { text: '活动已结束', disabled: true, className: 'bg-gray-300 text-gray-500 cursor-not-allowed' }
    if (isRegistered) return { text: '已报名', disabled: true, className: 'bg-green-500 text-white' }
    if (isFull) return { text: '名额已满', disabled: true, className: 'bg-gray-300 text-gray-500 cursor-not-allowed' }
    return {
      text: getFeeButtonText(activity!.fee),
      disabled: false,
      className: 'bg-blue-500 text-white active:bg-blue-600',
    }
  }

  const btnInfo = getButtonInfo()

  // ─── Gender text ───────────────────────────────────────────────────────────
  function genderLimitText(limit?: string) {
    switch (limit) {
      case 'male':
        return '仅限男生'
      case 'female':
        return '仅限女生'
      default:
        return '不限'
    }
  }

  // ─── Join method text ──────────────────────────────────────────────────────
  function joinMethodText(method: string) {
    return method === 'auto' ? '自动加入' : '需主办方审批'
  }

  return (
    <Layout showBack title="活动详情">
      <div className="pb-24">
        {/* ── Hero image gallery ──────────────────────────────────────────────── */}
        <div className="relative">
          <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Image indicator dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImageIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
          {/* Favorite toggle */}
          <button
            onClick={() => id && toggleFavorite(id)}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="text-xl">{isFav ? '❤️' : '🤍'}</span>
          </button>
          {/* Status badge */}
          {isFinished && (
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {getStatusText(activity.status)}
              </span>
            </div>
          )}
        </div>

        {/* ── Swipe hint for more images ──────────────────────────────────────── */}
        {images.length > 1 && !showAllImages && (
          <button
            onClick={() => setShowAllImages(true)}
            className="mx-4 mt-2 text-xs text-gray-400 flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            共 {images.length} 张图片
          </button>
        )}

        {/* ── Basic info ──────────────────────────────────────────────────────── */}
        <div className="px-4 pt-4">
          <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2">
            {activity.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] bg-blue-50 text-blue-600 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 mb-3">
            <svg className="mt-0.5 text-gray-400 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            <div>
              <p className="text-sm text-gray-800">
                {formatDate(activity.startTime, 'yyyy年MM月dd日 HH:mm')}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(activity.startTime, 'EEEE')}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 mb-4">
            <svg className="mt-0.5 text-gray-400 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="text-sm text-gray-800">{activity.location}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.locationDetail}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-2 bg-gray-50" />

        {/* ── Description ─────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2">活动介绍</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        <div className="h-2 bg-gray-50" />

        {/* ── Host info ───────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3">主办方</h2>
          {host && (
            <div
              onClick={() => navigate(`/user/${host.id}`)}
              className="flex items-center gap-3 active:bg-gray-50 rounded-xl p-2 -mx-2 cursor-pointer transition-colors"
            >
              <img
                src={host.avatar}
                alt={host.nickname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[15px] font-semibold text-gray-800">{host.nickname}</p>
                  {host.realNameVerified && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-medium">实名</span>
                  )}
                  {host.studentVerified && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">学生认证</span>
                  )}
                </div>
                <p className="text-[12px] text-gray-400 mb-0.5">{host.major} · {host.grade}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <span className="text-yellow-500 text-[13px]">★</span>
                    <span className="text-[13px] text-gray-600 font-medium">{host.rating}</span>
                    <span className="text-[12px] text-gray-400">({host.ratingCount})</span>
                  </div>
                  <span className="text-[12px] text-gray-300">|</span>
                  <span className="text-[12px] text-gray-400">已举办 {host.hostedCount} 场</span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          )}

          {/* Co-host */}
          {coHosts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">协办方</p>
              {coHosts.map(
                (coHost) =>
                  coHost && (
                    <div
                      key={coHost.id}
                      onClick={() => navigate(`/user/${coHost.id}`)}
                      className="flex items-center gap-3 active:bg-gray-50 rounded-xl p-2 -mx-2 cursor-pointer transition-colors"
                    >
                      <img
                        src={coHost.avatar}
                        alt={coHost.nickname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">
                          {coHost.nickname}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs text-gray-500">
                            {coHost.rating}
                          </span>
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        <div className="h-2 bg-gray-50" />

        {/* ── Access rules ────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">参与条件</h2>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">名额</span>
              <span className="text-sm text-gray-800 font-medium">
                {activity.currentParticipants}/{activity.accessRules.maxParticipants} 人
                {isFull && (
                  <span className="ml-1 text-xs text-red-500">（已满）</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">年龄限制</span>
              <span className="text-sm text-gray-800">
                {activity.accessRules.minAge && activity.accessRules.maxAge
                  ? `${activity.accessRules.minAge}~${activity.accessRules.maxAge} 岁`
                  : activity.accessRules.minAge
                    ? `${activity.accessRules.minAge} 岁以上`
                    : '不限'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">性别限制</span>
              <span className="text-sm text-gray-800">
                {genderLimitText(activity.accessRules.genderLimit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">加入方式</span>
              <span className="text-sm text-gray-800">
                {joinMethodText(activity.accessRules.joinMethod)}
              </span>
            </div>
          </div>
        </div>

        <div className="h-2 bg-gray-50" />

        {/* ── Fee section ─────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">费用说明</h2>
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">费用类型</span>
              <span className="text-sm text-gray-800 font-medium">
                {getFeeTypeText(activity.fee.type)}
              </span>
            </div>
            {activity.fee.type !== 'free' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {activity.fee.type === 'full' ? '总费用' : '留位费'}
                  </span>
                  <span className="text-sm text-gray-800 font-semibold">
                    {activity.fee.type === 'full'
                      ? formatAmount(activity.fee.totalAmount)
                      : formatAmount(activity.fee.depositAmount)}
                  </span>
                </div>
                {activity.fee.type === 'deposit' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">尾款（预授权）</span>
                    <span className="text-sm text-gray-800">
                      {formatAmount(activity.fee.balanceAmount)}
                    </span>
                  </div>
                )}
              </>
            )}
            {activity.fee.type === 'free' && (
              <p className="text-sm text-green-600 font-medium">
                本次活动免费，无需支付任何费用
              </p>
            )}
          </div>
        </div>

        <div className="h-2 bg-gray-50" />

        {/* ── Participants ────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            已报名 ({activity.currentParticipants}/{activity.accessRules.maxParticipants})
          </h2>
          {participants.length === 0 ? (
            <p className="text-sm text-gray-400">暂无参与者，快来成为第一个吧！</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map(
                (user) =>
                  user && (
                    <div
                      key={user.id}
                      onClick={() => navigate(`/user/${user.id}`)}
                      className="flex flex-col items-center gap-1 cursor-pointer active:opacity-70 transition-opacity"
                    >
                      <img
                        src={user.avatar}
                        alt={user.nickname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-[10px] text-gray-500 max-w-[48px] truncate">
                        {user.nickname}
                      </span>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        <div className="h-2 bg-gray-50" />

        {/* ── Q&A section ─────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            问答 ({activity.questions.length})
          </h2>

          {activity.questions.length === 0 ? (
            <p className="text-sm text-gray-400 mb-4">暂无问答，有问题可以在这里提问</p>
          ) : (
            <div className="space-y-4 mb-4">
              {/* Highlighted Q&As first */}
              {highlightedQAs.map((qa) => {
                const questionUser = getUserById(qa.userId)
                return (
                  <div
                    key={qa.id}
                    className="bg-amber-50 rounded-xl p-3 border border-amber-100"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500 text-xs font-medium mt-0.5 flex-shrink-0">
                        Q
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{qa.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {questionUser && (
                            <span className="text-[10px] text-gray-400">
                              {questionUser.nickname}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-300">
                            {formatDate(qa.createdAt, 'MM/dd')}
                          </span>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 bg-amber-100 rounded text-[10px] text-amber-600 font-medium flex-shrink-0">
                        精选
                      </span>
                    </div>
                    {qa.answer && (
                      <div className="mt-2 ml-5 flex items-start gap-2">
                        <span className="text-blue-500 text-xs font-medium mt-0.5 flex-shrink-0">
                          A
                        </span>
                        <p className="text-sm text-gray-700">{qa.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Regular Q&As */}
              {regularQAs.map((qa) => {
                const questionUser = getUserById(qa.userId)
                return (
                  <div key={qa.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 text-xs font-medium mt-0.5 flex-shrink-0">
                        Q
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{qa.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {questionUser && (
                            <span className="text-[10px] text-gray-400">
                              {questionUser.nickname}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-300">
                            {formatDate(qa.createdAt, 'MM/dd')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {qa.answer && (
                      <div className="mt-2 ml-5 flex items-start gap-2">
                        <span className="text-blue-500 text-xs font-medium mt-0.5 flex-shrink-0">
                          A
                        </span>
                        <p className="text-sm text-gray-700">{qa.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="h-2 bg-gray-50" />

        {/* ── Refund rules ────────────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">退订规则</h2>
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xs mt-0.5">✓</span>
              <p className="text-sm text-gray-600">
                活动开始前 <span className="font-semibold text-gray-800">24小时</span>{' '}
                取消：留位费全额退款，尾款预授权自动解冻
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-xs mt-0.5">✗</span>
              <p className="text-sm text-gray-600">
                活动开始前 <span className="font-semibold text-gray-800">24小时内</span>{' '}
                取消：留位费不退，尾款预授权解冻
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-xs mt-0.5">•</span>
              <p className="text-sm text-gray-600">
                免费活动可随时取消
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-xs mt-0.5">•</span>
              <p className="text-sm text-gray-600">
                主办方取消活动，全额退款 + 自动发放优惠券补偿
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacer for fixed bar */}
        <div className="h-4" />
      </div>

      {/* ── Bottom fixed action bar ───────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-lg border-t border-gray-100">
        <div
          className="flex items-center justify-between px-4 py-3 gap-3"
        >
          {/* Participant count */}
          <div className="flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="text-sm text-gray-600">
              {activity.currentParticipants}/{activity.accessRules.maxParticipants}
            </span>
          </div>

          {/* Action button */}
          <button
            disabled={btnInfo.disabled}
            onClick={() => {
              if (!btnInfo.disabled && !isRegistered) {
                navigate(`/register/${activity!.id}`)
              }
            }}
            className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-colors ${btnInfo.className}`}
          >
            {btnInfo.text}
          </button>
        </div>
        {/* Safe area for notch devices */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </Layout>
  )
}
export default ActivityDetail
