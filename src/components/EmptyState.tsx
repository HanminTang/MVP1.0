import React from 'react'
import { useNavigate } from 'react-router-dom'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionText?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="text-5xl mb-4">{icon || '📭'}</div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">{description}</p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 rounded-full text-sm font-medium text-indigo-600 bg-indigo-50 active:bg-indigo-100 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

// 推荐活动卡片（空状态引导用）
export function RecommendCard({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
      <p className="text-sm font-medium text-gray-700 mb-2">看看有什么有趣的活动？</p>
      <p className="text-xs text-gray-500 mb-3">我们为你精选了一些热门活动</p>
      <button
        onClick={onBrowse}
        className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-indigo-500 active:bg-indigo-600"
      >
        浏览活动
      </button>
    </div>
  )
}
