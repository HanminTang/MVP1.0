import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../store/userStore'

export function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useUserStore()
  const isHost = currentUser.role === 'host'

  const userTabs = [
    { path: '/', icon: '🏠', label: '发现' },
    { path: '/orders', icon: '📋', label: '我的' },
    { path: '/timeline', icon: '📅', label: '生涯' },
    { path: '/profile', icon: '👤', label: '我的' },
  ]

  const hostTabs = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/host/manage', icon: '📊', label: '管理' },
    { path: '/host/wallet', icon: '💰', label: '钱包' },
    { path: '/profile', icon: '👤', label: '我的' },
  ]

  const tabs = isHost ? hostTabs : userTabs
  const currentPath = location.pathname

  // 只在主要页面显示TabBar
  const hidePaths = ['/activity/', '/register/', '/order/', '/host/publish', '/host/activity/', '/user/', '/review/', '/messages', '/coupons', '/timeline/']
  if (hidePaths.some(p => currentPath.startsWith(p))) return null

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-lg border-t border-gray-100 z-40">
      <div className="flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center py-1 px-3 min-w-[60px] transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{tab.icon}</span>
              <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
