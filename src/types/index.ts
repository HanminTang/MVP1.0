// 用户角色
export type UserRole = 'user' | 'host'

// 用户信息
export interface User {
  id: string
  nickname: string
  avatar: string
  role: UserRole
  gender: 'male' | 'female' | 'secret'
  age: number
  bio: string
  tags: string[]
  hostedCount: number
  joinedCount: number
  rating: number
  ratingCount: number
  createdAt: string
}

// 活动费用类型
export type FeeType = 'free' | 'full' | 'deposit'

// 活动状态
export type ActivityStatus = 'pending' | 'published' | 'confirmed' | 'ended' | 'cancelled'

// 加入方式
export type JoinMethod = 'auto' | 'approval'

// 准入条件
export interface AccessRules {
  maxParticipants: number
  minAge?: number
  maxAge?: number
  genderLimit?: 'all' | 'male' | 'female'
  joinMethod: JoinMethod
}

// 费用设置
export interface FeeSetting {
  type: FeeType
  totalAmount: number // 总费用（全款模式）或 留位费+尾款
  depositAmount: number // 留位费
  balanceAmount: number // 尾款
}

// 活动信息
export interface Activity {
  id: string
  title: string
  description: string
  cover: string
  images: string[]
  hostId: string
  coHostIds: string[]
  tags: string[]
  location: string
  locationDetail: string
  startTime: string
  endTime: string
  status: ActivityStatus
  accessRules: AccessRules
  fee: FeeSetting
  currentParticipants: number
  participantIds: string[]
  pendingIds: string[]
  questions: QA[]
  createdAt: string
  groupQrCode?: string
}

// 问答
export interface QA {
  id: string
  userId: string
  question: string
  answer?: string
  isHighlighted: boolean
  createdAt: string
}

// 报名状态
export type RegistrationStatus =
  | 'pending_approval'
  | 'pending_payment'
  | 'registered'
  | 'cancelled'
  | 'ended'
  | 'rejected'

// 支付状态
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'authorized' | 'fully_paid' | 'refunded' | 'unfrozen'

// 报名/订单信息
export interface Registration {
  id: string
  activityId: string
  userId: string
  status: RegistrationStatus
  paymentStatus: PaymentStatus
  depositAmount: number
  balanceAmount: number
  paidAt?: string
  authorizedAt?: string
  cancelledAt?: string
  cancelReason?: string
  createdAt: string
  // 支付超时（15分钟）
  paymentDeadline?: string
}

// 评价
export interface Review {
  id: string
  activityId: string
  fromUserId: string
  toUserId: string
  rating: number
  tags: string[]
  comment: string
  createdAt: string
}

// 优惠券
export interface Coupon {
  id: string
  userId: string
  amount: number
  minAmount: number // 最低使用金额，0为无门槛
  description: string
  source: string // 来源说明
  expiresAt: string
  isUsed: boolean
  usedAt?: string
  createdAt: string
}

// 钱包信息
export interface Wallet {
  hostId: string
  frozen: number // 冻结托管
  pending: number // 待结算
  available: number // 可提现
  totalEarnings: number // 累计收入
}

// 钱包明细
export interface WalletTransaction {
  id: string
  hostId: string
  type: 'deposit' | 'settle' | 'withdraw' | 'refund'
  amount: number
  description: string
  activityId?: string
  createdAt: string
}

// 消息通知
export interface Notification {
  id: string
  userId: string
  type: 'registration' | 'payment' | 'activity_change' | 'refund' | 'review' | 'system'
  title: string
  content: string
  isRead: boolean
  linkTo?: string
  createdAt: string
}

// 里程碑徽章
export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earnedAt?: string
}
