import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Activity } from '../types'
import { formatDate, formatAmount, getStatusText, getStatusColor, isAfterNow } from '../utils'
import { getUserById } from '../mock/data'
import { useActivityStore } from '../store/activityStore'

interface ActivityCardProps {
  activity: Activity
  showStatus?: boolean
  compact?: boolean
}

export function ActivityCard({ activity, showStatus = false, compact = false }: ActivityCardProps) {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useActivityStore()
  const isFav = favorites.includes(activity.id)
  const host = getUserById(activity.hostId)
  const isUpcoming = isAfterNow(activity.startTime)
  const isFull = activity.currentParticipants >= activity.accessRules.maxParticipants

  return (
    <div
      onClick={() => navigate(`/activity/${activity.id}`)}
      className={`bg-white rounded-2xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer ${
        compact ? 'mb-2' : 'mb-3 shadow-sm'
      }`}
    >
      {/* 封面图 */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        <img
          src={activity.cover}
          alt={activity.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 费用标签 */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            activity.fee.type === 'free'
              ? 'bg-green-500/90 text-white'
              : 'bg-white/90 text-gray-700'
          }`}>
            {activity.fee.type === 'free' ? '免费' : formatAmount(activity.fee.totalAmount)}
          </span>
        </div>
        {/* 报名状态 */}
        {isFull && isUpcoming && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/90 text-white backdrop-blur-sm">
              已满
            </span>
          </div>
        )}
        {/* 活动状态 */}
        {showStatus && (
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusColor(activity.status)}`}>
              {getStatusText(activity.status)}
            </span>
          </div>
        )}
        {/* 收藏按钮 */}
        {!showStatus && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(activity.id) }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="text-base">{isFav ? '❤️' : '🤍'}</span>
          </button>
        )}
      </div>

      {/* 内容 */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1.5 line-clamp-2">
          {activity.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <span>{formatDate(activity.startTime, 'MM月dd日 HH:mm')}</span>
          <span className="mx-1">·</span>
          <span>{activity.location}</span>
        </div>
        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {activity.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] bg-gray-50 text-gray-500">
              {tag}
            </span>
          ))}
        </div>
        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {host && (
              <>
                <img src={host.avatar} alt="" className="w-4 h-4 rounded-full" />
                <span className="text-xs text-gray-400">{host.nickname}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>👥 {activity.currentParticipants}/{activity.accessRules.maxParticipants}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
