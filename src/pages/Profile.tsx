import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useUserStore } from '../store/userStore'
import { useActivityStore } from '../store/activityStore'

export function Profile() {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)
  const toggleRole = useUserStore((s) => s.toggleRole)
  const getUnreadCount = useUserStore((s) => s.getUnreadCount)
  const activities = useActivityStore((s) => s.activities)

  const unreadCount = getUnreadCount()
  const isHost = currentUser.role === 'host'

  // Calculate stats from user data
  const participatedCount = currentUser.joinedCount
  const hostedCount = currentUser.hostedCount

  const menuGridItems = [
    { label: '我的报名', icon: '📋', path: '/orders' },
    { label: '我的收藏', icon: '❤️', path: '/favorites' },
    { label: '活动生涯', icon: '🏆', path: '/timeline' },
    { label: '优惠券', icon: '🎫', path: '/coupons' },
  ]

  const menuListItems = [
    { label: '评价管理', icon: '💬', path: '/reviews' },
    { label: '消息通知', icon: '🔔', path: '/messages', badge: unreadCount },
  ]

  return (
    <Layout title="我的">
      {/* 用户信息区域 */}
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="flex items-start gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.nickname}
            className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {currentUser.nickname}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isHost ? 'bg-orange-50 text-orange-500' : 'bg-indigo-50 text-indigo-500'
                }`}
              >
                {isHost ? 'B端·主办方' : 'C端·参与者'}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
              {currentUser.bio || '这个人很懒，什么都没写～'}
            </p>
          </div>
        </div>

        {/* 标签 */}
        {currentUser.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {currentUser.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs bg-gray-50 text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 统计行 */}
        <div className="grid grid-cols-3 gap-0 mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">{participatedCount}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">参与</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-100">
            <span className="text-lg font-bold text-gray-800">{hostedCount}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">举办</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">
              {currentUser.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">评分</span>
          </div>
        </div>
      </div>

      {/* 2x2 菜单网格 */}
      <div className="mx-4 mt-3">
        <div className="grid grid-cols-2 gap-2">
          {menuGridItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <svg
                className="w-4 h-4 text-gray-300 ml-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* 列表菜单 */}
      <div className="mx-4 mt-2 space-y-2">
        {menuListItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 w-full bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-medium min-w-[18px] text-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
            <svg
              className="w-4 h-4 text-gray-300 ml-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* 角色切换 */}
      <div className="mx-4 mt-3 mb-6">
        <button
          onClick={toggleRole}
          className="flex items-center justify-between w-full bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <span className="text-sm font-medium text-gray-700">
              {isHost ? '切换为C端' : '切换为B端'}
            </span>
          </div>
          {/* Toggle Switch */}
          <div
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
              isHost ? 'bg-indigo-500' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isHost ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>
    </Layout>
  )
}
export default Profile
