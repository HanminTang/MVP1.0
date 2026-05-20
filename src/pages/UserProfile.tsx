import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ActivityCard } from '../components/ActivityCard'
import { getUserById, allUsers } from '../mock/data'
import { useActivityStore } from '../store/activityStore'
import { useWalletStore } from '../store/walletStore'

export function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = getUserById(id || '')
  const { activities } = useActivityStore()
  const { getReviewsForUser } = useWalletStore()

  if (!user) {
    return (
      <Layout title="用户主页" showBack>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">用户不存在</p>
        </div>
      </Layout>
    )
  }

  const isHost = user.role === 'host'
  const userReviews = getReviewsForUser(user.id)
  const avgRating =
    userReviews.length > 0
      ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
      : user.rating

  // Recent activities: hosted or participated
  const recentActivities = activities
    .filter((a) => a.hostId === user.id || a.participantIds.includes(user.id))
    .slice(0, 5)

  const renderStars = (rating: number) => {
    const full = Math.floor(rating)
    const hasHalf = rating - full >= 0.5
    const empty = 5 - full - (hasHalf ? 1 : 0)
    return (
      <span className="inline-flex items-center text-amber-400 text-xs tracking-tight">
        {'★'.repeat(full)}
        {hasHalf && '★'}
        <span className="text-gray-300">{'★'.repeat(empty)}</span>
      </span>
    )
  }

  return (
    <Layout title="用户主页" showBack>
      {/* User Info */}
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="flex items-start gap-3.5">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-16 h-16 rounded-full border-2 border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-800 truncate">{user.nickname}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isHost ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                }`}
              >
                {isHost ? 'B端·主办方' : 'C端·参与者'}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
              {user.bio || '这个人很懒，什么都没写~'}
            </p>
          </div>
        </div>

        {/* Tags */}
        {user.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs bg-gray-50 text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-0 mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">{user.hostedCount}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">发起</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-100">
            <span className="text-lg font-bold text-gray-800">{user.joinedCount}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">参与</span>
          </div>
          <div className="flex flex-col items-center border-r border-gray-100">
            <span className="text-lg font-bold text-gray-800">{avgRating.toFixed(1)}</span>
            <span className="mt-0.5">{renderStars(avgRating)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">{userReviews.length}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">评价</span>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="px-4 mt-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">最近动态</h3>
        {recentActivities.length > 0 ? (
          <div>
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} compact />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">暂无活动记录</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
export default UserProfile
