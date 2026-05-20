import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../store/userStore'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  rightAction?: React.ReactNode
  hideTabBar?: boolean
}

export function Layout({ children, title, showBack = false, rightAction, hideTabBar = false }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const unreadCount = useUserStore((s) => s.getUnreadCount())

  const showHeader = title || showBack

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {showHeader && (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-12">
            <div className="flex items-center gap-2 min-w-[60px]">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-8 h-8 flex items-center justify-center -ml-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}
            </div>
            {title && <h1 className="text-base font-semibold text-gray-800 truncate">{title}</h1>}
            <div className="flex items-center gap-1 min-w-[60px] justify-end">
              {rightAction}
              {/* 消息入口 */}
              {!location.pathname.startsWith('/messages') && (
                <button
                  onClick={() => navigate('/messages')}
                  className="w-8 h-8 flex items-center justify-center relative"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>
      )}
      <main className={showHeader ? '' : ''}>{children}</main>
    </div>
  )
}
