import { format, formatDistanceToNow, isBefore, isAfter, addMinutes, differenceInHours } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 格式化日期
export function formatDate(dateStr: string, pattern = 'MM月dd日 HH:mm'): string {
  return format(new Date(dateStr), pattern, { locale: zhCN })
}

// 格式化为简短日期
export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), 'MM/dd HH:mm', { locale: zhCN })
}

// 相对时间
export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: zhCN })
}

// 检查是否在指定时间之前
export function isBeforeNow(dateStr: string): boolean {
  return isBefore(new Date(dateStr), new Date())
}

// 检查是否在指定时间之后
export function isAfterNow(dateStr: string): boolean {
  return isAfter(new Date(dateStr), new Date())
}

// 支付截止时间（15分钟）
export function getPaymentDeadline(createdAt: string): Date {
  return addMinutes(new Date(createdAt), 15)
}

// 检查支付是否超时
export function isPaymentExpired(createdAt: string): boolean {
  return isBeforeNow(getPaymentDeadline(createdAt).toISOString())
}

// 距离活动开始还有多少小时
export function hoursUntilActivity(startTime: string): number {
  return differenceInHours(new Date(startTime), new Date())
}

// 生成唯一ID
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// 金额格式化
export function formatAmount(amount: number): string {
  if (amount === 0) return '免费'
  return `¥${amount}`
}

// 活动状态中文
export function getStatusText(status: string): string {
  const map: Record<string, string> = {
    pending: '待审核',
    published: '已发布',
    confirmed: '已成行',
    ended: '已结束',
    cancelled: '已取消',
    pending_approval: '待审批',
    pending_payment: '待支付',
    registered: '已报名',
    rejected: '已拒绝',
  }
  return map[status] || status
}

// 活动状态颜色
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    published: 'text-blue-600 bg-blue-50',
    confirmed: 'text-green-600 bg-green-50',
    ended: 'text-gray-500 bg-gray-50',
    cancelled: 'text-red-500 bg-red-50',
    pending_approval: 'text-yellow-600 bg-yellow-50',
    pending_payment: 'text-orange-500 bg-orange-50',
    registered: 'text-green-600 bg-green-50',
    rejected: 'text-red-500 bg-red-50',
  }
  return map[status] || 'text-gray-500 bg-gray-50'
}

// 支付状态中文
export function getPaymentStatusText(status: string): string {
  const map: Record<string, string> = {
    unpaid: '未支付',
    deposit_paid: '留位费已付',
    authorized: '尾款已授权',
    fully_paid: '已全额支付',
    refunded: '已退款',
    unfrozen: '已解冻',
  }
  return map[status] || status
}

// 费用类型中文
export function getFeeTypeText(type: string): string {
  const map: Record<string, string> = {
    free: '免费活动',
    full: '全款支付',
    deposit: '留位费 + 尾款预授权',
  }
  return map[type] || type
}
