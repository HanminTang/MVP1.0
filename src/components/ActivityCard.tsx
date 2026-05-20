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
        compact ? 'mb-3' : 'mb-3.5 shadow-sm'
      }`}
    >
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        <img
          src={activity.cover}
          alt={activity.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-[13px] font-medium backdrop-blur-sm ${
            activity.fee.type === 'free'
              ? 'bg-green-500/90 text-white'
              : 'bg-white/90 text-gray-700'
          }`}>
            {activity.fee.type === 'free' ? '免费' : formatAmount(activity.fee.totalAmount)}
          </span>
        </div>
        {isFull && isUpcoming && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-500/90 text-white backdrop-blur-sm">
              已满
            </span>
          </div>
        )}
        {showStatus && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-[13px] font-medium backdrop-blur-sm ${getStatusColor(activity.status)}`}>
              {getStatusText(activity.status)}
            </span>
          </div>
        )}
        {!showStatus && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(activity.id) }}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="text-[18px]">{isFav ? '❤️' : '🤍'}</span>
          </button>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">
          {activity.title}
        </h3>
        <div className="flex items-center gap-1 text-[13px] text-gray-400 mb-2.5">
          <span>{formatDate(activity.startTime, 'MM月dd日 HH:mm')}</span>
          <span className="mx-1">·</span>
          <span>{activity.location}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {activity.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-md text-[11px] bg-gray-50 text-gray-500">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {host && (
              <>
                <img src={host.avatar} alt="" className="w-5 h-5 rounded-full" />
                <span className="text-[13px] text-gray-400">{host.nickname}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-[13px] text-gray-400">
            <span>👥 {activity.currentParticipants}/{activity.accessRules.maxParticipants}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
