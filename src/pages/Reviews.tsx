import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ConfirmDialog } from '../components/Modal'
import { EmptyState } from '../components/EmptyState'
import { useUserStore } from '../store/userStore'
import { useWalletStore } from '../store/walletStore'
import { getActivityById, getUserById } from '../mock/data'
import { formatDate, timeAgo } from '../utils'

type ReviewTab = 'received' | 'sent'

export function Reviews() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ReviewTab>('received')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const currentUser = useUserStore((s) => s.currentUser)
  const reviews = useWalletStore((s) => s.reviews)
  const deleteReview = useWalletStore((s) => s.deleteReview)

  const receivedReviews = useMemo(
    () => reviews.filter((r) => r.toUserId === currentUser.id),
    [reviews, currentUser.id]
  )

  const sentReviews = useMemo(
    () => reviews.filter((r) => r.fromUserId === currentUser.id),
    [reviews, currentUser.id]
  )

  const currentReviews = activeTab === 'received' ? receivedReviews : sentReviews

  const handleDelete = () => {
    if (deleteTarget) {
      deleteReview(deleteTarget)
      setDeleteTarget(null)
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  const renderReviewCard = (review: typeof currentReviews[0]) => {
    const activity = getActivityById(review.activityId)
    const fromUser = getUserById(review.fromUserId)
    const isMine = review.fromUserId === currentUser.id
    const displayUser = isMine ? getUserById(review.toUserId) : fromUser
    const isExpanded = expandedId === review.id

    return (
      <div
        key={review.id}
        onClick={() => setExpandedId(isExpanded ? null : review.id)}
        className={`bg-white rounded-2xl p-4 shadow-sm active:bg-gray-50 cursor-pointer transition-all ${
          isExpanded ? 'ring-1 ring-indigo-200' : ''
        }`}
      >
        {/* Header: user + stars */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <img
              src={displayUser?.avatar}
              alt={displayUser?.nickname}
              className="w-10 h-10 rounded-full bg-gray-100"
              onClick={(e) => { e.stopPropagation(); if (displayUser) navigate(`/user/${displayUser.id}`) }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] font-medium text-gray-800">
                  {displayUser?.nickname || '未知用户'}
                </p>
                {displayUser?.studentVerified && (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-500">学生</span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                {displayUser?.major} · {displayUser?.grade} · {timeAgo(review.createdAt)}
              </p>
            </div>
          </div>
          {renderStars(review.rating)}
        </div>

        {/* Tags */}
        {review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {review.tags.map((tag, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment */}
        <p className={`text-[13px] text-gray-700 leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {review.comment}
        </p>

        {/* Expanded detail */}
        {isExpanded && (
          <div className="mb-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-gray-400">来自活动：</span>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/activity/${review.activityId}`) }}
                className="text-[12px] text-indigo-500 font-medium"
              >
                {activity?.title || '查看活动'}
              </button>
            </div>
            <p className="text-[11px] text-gray-400">{formatDate(review.createdAt, 'yyyy年MM月dd日 HH:mm')}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/activity/${review.activityId}`) }}
            className="text-[12px] text-indigo-500 truncate max-w-[60%]"
          >
            {activity?.title || '查看活动'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">
              {isExpanded ? '收起' : '点击展开'}
            </span>
            {isMine && (
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(review.id) }}
                className="text-[11px] text-red-400 active:text-red-600 transition-colors"
              >
                删除
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout title="我的评价" showBack>
      {/* Tabs */}
      <div className="sticky top-12 z-10 bg-gray-50 px-4 pt-3 pb-0">
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          {(
            [
              { key: 'received' as const, label: `收到的评价 (${receivedReviews.length})` },
              { key: 'sent' as const, label: `发出的评价 (${sentReviews.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-500 active:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="px-4 py-3 space-y-3">
        {currentReviews.length === 0 ? (
          <EmptyState
            icon="💬"
            title={activeTab === 'received' ? '还没有收到评价' : '还没有发出评价'}
            description={
              activeTab === 'received'
                ? '参加活动后，主办方和其他参与者可能会给你评价'
                : '参加完活动后，去给活动和主办方一个评价吧'
            }
          />
        ) : (
          currentReviews.map(renderReviewCard)
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="删除评价"
        content="确定要删除这条评价吗？删除后无法恢复。"
        confirmText="删除"
        danger
      />
    </Layout>
  )
}
export default Reviews
