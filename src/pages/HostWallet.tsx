import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal'
import { useWalletStore } from '../store/walletStore'
import { useToast } from '../components/Toast'
import { formatDate, formatAmount } from '../utils'

export default function HostWallet() {
  const { wallet, transactions, withdraw } = useWalletStore()
  const { show } = useToast()
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount)
    if (!amount || amount <= 0) { show('请输入有效金额', 'error'); return }
    if (amount > wallet.available) { show('提现金额超出可用余额', 'error'); return }
    const success = withdraw(amount)
    if (success) {
      show('提现申请已提交', 'success')
      setShowWithdraw(false)
      setWithdrawAmount('')
    }
  }

  const getTxIcon = (type: string) => {
    const map: Record<string, string> = {
      deposit: '📥', settle: '✅', withdraw: '📤', refund: '🔄',
    }
    return map[type] || '💰'
  }

  const getTxColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-500'
  }

  return (
    <Layout title="我的钱包">
      {/* 余额卡片 */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="text-xs text-white/70 mb-1">可提现余额</div>
          <div className="text-3xl font-bold mb-4">¥{wallet.available.toFixed(2)}</div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] text-white/60">冻结托管</div>
              <div className="text-sm font-semibold">¥{wallet.frozen}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/60">待结算</div>
              <div className="text-sm font-semibold">¥{wallet.pending}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/60">累计收入</div>
              <div className="text-sm font-semibold">¥{wallet.totalEarnings}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowWithdraw(true)}
          className="w-full mt-3 h-11 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 active:bg-indigo-100 transition-colors"
        >
          申请提现
        </button>
      </div>

      {/* 说明 */}
      <div className="px-4 mt-4">
        <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
          <p className="font-medium mb-1">资金说明</p>
          <ul className="space-y-0.5">
            <li>冻结托管：用户已支付的留位费，活动结束后结算</li>
            <li>待结算：活动已结束，等待系统自动结算</li>
            <li>可提现：已结算到钱包，可随时提现</li>
          </ul>
        </div>
      </div>

      {/* 交易明细 */}
      <div className="px-4 mt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">交易明细</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">暂无交易记录</div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="text-lg">{getTxIcon(tx.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700 truncate">{tx.description}</div>
                  <div className="text-[10px] text-gray-400">{formatDate(tx.createdAt, 'MM/dd HH:mm')}</div>
                </div>
                <div className={`text-sm font-semibold ${getTxColor(tx.amount)}`}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 提现弹窗 */}
      <Modal visible={showWithdraw} onClose={() => setShowWithdraw(false)} title="申请提现">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">可提现余额</div>
            <div className="text-xl font-bold text-gray-800">¥{wallet.available.toFixed(2)}</div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">提现金额</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="请输入提现金额"
              max={wallet.available}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWithdrawAmount(String(wallet.available))}
              className="px-3 py-1 rounded-lg text-xs text-indigo-600 bg-indigo-50"
            >
              全部提现
            </button>
          </div>
          <button
            onClick={handleWithdraw}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-indigo-500 active:bg-indigo-600"
          >
            确认提现
          </button>
        </div>
      </Modal>
    </Layout>
  )
}
