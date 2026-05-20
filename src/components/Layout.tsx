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
          <div className="flex items-center justify-between px-4 h-[52px]">
            <div className="flex items-center gap-2 min-w-[64px]">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-9 h-9 flex items-center justify-center -ml-2"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}
            </div>
            {title && <h1 className="text-[17px] font-semibold text-gray-800 truncate">{title}</h1>}
            <div className="flex items-center gap-1 min-w-[64px] justify-end">
              {rightAction}
              {!location.pathname.startsWith('/messages') && (
                <button
                  onClick={() => navigate('/messages')}
                  className="w-9 h-9 flex items-center justify-center relative"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>
      )}
      <main>{children}</main>
    </div>
  )
}
