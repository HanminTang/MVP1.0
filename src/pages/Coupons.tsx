import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { EmptyState } from '../components/EmptyState'
import { useUserStore } from '../store/userStore'
import { formatDate, isAfterNow } from '../utils'

export function Coupons() {
  const navigate = useNavigate()
  const { coupons } = useUserStore()
  const [tab, setTab] = useState<'available' | 'used'>('available')

  const available = coupons.filter((c) => !c.isUsed && isAfterNow(c.expiresAt))
  const usedOrExpired = coupons.filter((c) => c.isUsed || !isAfterNow(c.expiresAt))

  const list = tab === 'available' ? available : usedOrExpired

  return (
    <Layout title="优惠券" showBack>
      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        {[
          { key: 'available' as const, label: `可使用 (${available.length})` },
          { key: 'used' as const, label: `已使用/已过期 (${usedOrExpired.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              tab === t.key ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="🎫"
          title={tab === 'available' ? '暂无可用优惠券' : '暂无记录'}
          description={
            tab === 'available' ? '参加活动有机会获得优惠券哦' : undefined
          }
          actionText={tab === 'available' ? '去参加活动' : undefined}
          onAction={tab === 'available' ? () => navigate('/') : undefined}
        />
      ) : (
        <div className="px-4 pt-3 space-y-3 pb-4">
          {list.map((coupon) => {
            const isExpired = !isAfterNow(coupon.expiresAt)
            const isDisabled = coupon.isUsed || isExpired

            return (
              <div
                key={coupon.id}
                className={`rounded-2xl overflow-hidden border-2 ${
                  isDisabled ? 'border-gray-200 bg-gray-50' : 'border-indigo-200 bg-white'
                }`}
              >
                <div className="flex items-stretch">
                  {/* Amount */}
                  <div
                    className={`w-28 flex flex-col items-center justify-center py-5 shrink-0 ${
                      isDisabled
                        ? 'bg-gray-200'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                    }`}
                  >
                    <div
                      className={`text-3xl font-black ${
                        isDisabled ? 'text-gray-400' : 'text-white'
                      }`}
                    >
                      ¥{coupon.amount}
                    </div>
                    <div
                      className={`text-[10px] mt-1 ${
                        isDisabled ? 'text-gray-400' : 'text-white/80'
                      }`}
                    >
                      {coupon.minAmount > 0 ? `满${coupon.minAmount}可用` : '无门槛'}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 px-4 py-3.5 flex flex-col justify-center min-w-0">
                    <p className="text-sm font-medium text-gray-700 mb-1.5 line-clamp-1">
                      {coupon.description}
                    </p>
                    <p className="text-[10px] text-gray-400 mb-0.5">来源: {coupon.source}</p>
                    <p className="text-[10px] text-gray-400">
                      {isExpired
                        ? '已过期'
                        : coupon.isUsed
                        ? `已于 ${formatDate(coupon.usedAt || '', 'MM/dd')} 使用`
                        : `有效期至 ${formatDate(coupon.expiresAt, 'yyyy/MM/dd')}`}
                    </p>
                  </div>

                  {/* Status badge */}
                  {isDisabled && (
                    <div className="flex items-center pr-3 shrink-0">
                      <span className="text-[10px] font-medium text-gray-400 border border-gray-300 rounded-full px-2 py-0.5">
                        {coupon.isUsed ? '已使用' : '已过期'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
export default Coupons
