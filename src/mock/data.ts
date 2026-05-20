import type { User, Activity, Registration, Review, Coupon, Wallet, WalletTransaction, Notification, Badge } from '../types'

// 当前模拟用户（C端）
export const currentUser: User = {
  id: 'user_1',
  nickname: '小趣同学',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  role: 'user',
  gender: 'female',
  age: 24,
  bio: '喜欢探索新事物，周末想找点有趣的事情做～',
  tags: ['摄影', '徒步', '咖啡', '读书'],
  hostedCount: 3,
  joinedCount: 28,
  rating: 4.8,
  ratingCount: 15,
  createdAt: '2025-06-15',
}

// 模拟B端主办方用户
export const hosts: User[] = [
  {
    id: 'host_1',
    nickname: '城市漫游家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host1',
    role: 'host',
    gender: 'male',
    age: 28,
    bio: '专注于城市探索和文化体验，已举办50+场活动',
    tags: ['城市探索', '文化体验', '摄影'],
    hostedCount: 52,
    joinedCount: 12,
    rating: 4.9,
    ratingCount: 230,
    createdAt: '2024-03-10',
  },
  {
    id: 'host_2',
    nickname: '手作工坊Lily',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host2',
    role: 'host',
    gender: 'female',
    age: 26,
    bio: '手工爱好者，带你体验各种有趣的手作课程',
    tags: ['手作', '烘焙', '花艺'],
    hostedCount: 35,
    joinedCount: 8,
    rating: 4.7,
    ratingCount: 156,
    createdAt: '2024-06-20',
  },
  {
    id: 'host_3',
    nickname: '运动搭子老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host3',
    role: 'host',
    gender: 'male',
    age: 30,
    bio: '各种户外运动爱好者，周末一起出汗！',
    tags: ['飞盘', '骑行', '徒步', '攀岩'],
    hostedCount: 68,
    joinedCount: 20,
    rating: 4.8,
    ratingCount: 312,
    createdAt: '2024-01-05',
  },
]

// 模拟其他参与者
export const participants: User[] = [
  {
    id: 'user_2', nickname: '追风少年', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2',
    role: 'user', gender: 'male', age: 22, bio: '大学生，爱好运动', tags: ['飞盘', '篮球', '摄影'],
    hostedCount: 0, joinedCount: 15, rating: 4.5, ratingCount: 8, createdAt: '2025-09-01',
  },
  {
    id: 'user_3', nickname: '草莓味的猫', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3',
    role: 'user', gender: 'female', age: 25, bio: '咖啡重度爱好者', tags: ['咖啡', '读书', '手作'],
    hostedCount: 1, joinedCount: 22, rating: 4.9, ratingCount: 12, createdAt: '2025-07-20',
  },
  {
    id: 'user_4', nickname: '一起去看海', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4',
    role: 'user', gender: 'female', age: 23, bio: '旅行博主预备选手', tags: ['旅行', '摄影', '徒步'],
    hostedCount: 0, joinedCount: 18, rating: 4.6, ratingCount: 10, createdAt: '2025-08-15',
  },
  {
    id: 'user_5', nickname: '代码诗人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u5',
    role: 'user', gender: 'male', age: 27, bio: '程序员，周末想多出去走走', tags: ['徒步', '读书', '电影'],
    hostedCount: 2, joinedCount: 30, rating: 4.7, ratingCount: 18, createdAt: '2025-04-10',
  },
  {
    id: 'user_6', nickname: '花花世界', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u6',
    role: 'user', gender: 'female', age: 26, bio: '花艺设计师', tags: ['花艺', '手作', '烘焙'],
    hostedCount: 0, joinedCount: 25, rating: 4.8, ratingCount: 14, createdAt: '2025-05-20',
  },
]

// 生成未来和过去的日期
const now = new Date()
const futureDate = (days: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
const pastDate = (days: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

// 模拟活动数据
export const mockActivities: Activity[] = [
  {
    id: 'act_1',
    title: '城市夜骑·探索城市灯光下的另一面',
    description: '一起骑上单车，穿过老城区的小巷，感受城市夜晚的独特魅力。路线经过3个特色街区，全程约15km，难度适中，新手友好。我们会停靠2个打卡点，一起拍照留念。提供头盔和骑行灯，你只需要带上好心情！',
    cover: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    ],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['运动', '骑行', '夜生活', '城市探索'],
    location: '上海市',
    locationDetail: '人民广场地铁站2号口集合',
    startTime: futureDate(3),
    endTime: futureDate(3),
    status: 'published',
    accessRules: { maxParticipants: 20, minAge: 18, maxAge: 40, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'deposit', totalAmount: 68, depositAmount: 29, balanceAmount: 39 },
    currentParticipants: 12,
    participantIds: ['user_2', 'user_4', 'user_5'],
    pendingIds: [],
    questions: [
      { id: 'q1', userId: 'user_2', question: '需要自己带车吗？', answer: '不用哦，我们统一提供车辆和装备～', isHighlighted: true, createdAt: pastDate(2) },
      { id: 'q2', userId: 'user_4', question: '下雨怎么办？', answer: '活动前一天会通知是否延期，延期可全额退款', isHighlighted: false, createdAt: pastDate(1) },
    ],
    createdAt: pastDate(7),
  },
  {
    id: 'act_2',
    title: '周末手作·DIY干花香薰蜡烛',
    description: '用天然大豆蜡和干花，制作属于自己的香薰蜡烛。全程有老师指导，零基础也能做出超美的作品。包含所有材料费，做好可直接带走。适合闺蜜约会或者一个人来认识新朋友～',
    cover: 'https://images.unsplash.com/photo-1602607439100-adf44914c3c0?w=600',
    images: [
      'https://images.unsplash.com/photo-1602607439100-adf44914c3c0?w=800',
    ],
    hostId: 'host_2',
    coHostIds: [],
    tags: ['手作', '文艺', '周末', '放松'],
    location: '上海市',
    locationDetail: '武康路XX号2楼·手作工坊',
    startTime: futureDate(5),
    endTime: futureDate(5),
    status: 'published',
    accessRules: { maxParticipants: 12, minAge: 16, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'full', totalAmount: 128, depositAmount: 128, balanceAmount: 0 },
    currentParticipants: 8,
    participantIds: ['user_3', 'user_6'],
    pendingIds: [],
    questions: [
      { id: 'q3', userId: 'user_3', question: '做好的蜡烛可以带上地铁吗？', answer: '可以的～我们会提供包装盒，方便携带', isHighlighted: true, createdAt: pastDate(3) },
    ],
    createdAt: pastDate(10),
  },
  {
    id: 'act_3',
    title: '晨间徒步·佘山看日出',
    description: '凌晨4点集合，一起徒步登顶佘山，迎接第一缕阳光。登顶后一起分享早餐，拍最美的日出照片。全程约5km，难度较低。提供早餐和热饮，你需要准备舒适的鞋子和外套。',
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    ],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['户外', '徒步', '日出', '自然'],
    location: '上海市',
    locationDetail: '佘山国家森林公园东门',
    startTime: futureDate(7),
    endTime: futureDate(7),
    status: 'published',
    accessRules: { maxParticipants: 15, minAge: 18, maxAge: 45, genderLimit: 'all', joinMethod: 'approval' },
    fee: { type: 'deposit', totalAmount: 45, depositAmount: 15, balanceAmount: 30 },
    currentParticipants: 10,
    participantIds: ['user_2', 'user_5'],
    pendingIds: ['user_4'],
    questions: [],
    createdAt: pastDate(5),
  },
  {
    id: 'act_4',
    title: '读书分享会·聊聊最近在读的那本书',
    description: '带上你最近在读的一本书，和5-8个小伙伴围坐在一起，分享你的阅读感受。没有固定书目限制，小说、散文、专业书都可以。现场提供手冲咖啡和小点心，轻松自在的氛围。',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    ],
    hostId: 'host_1',
    coHostIds: [],
    tags: ['读书', '社交', '文艺', '咖啡'],
    location: '上海市',
    locationDetail: '永嘉路XX号·独立书店',
    startTime: futureDate(10),
    endTime: futureDate(10),
    status: 'published',
    accessRules: { maxParticipants: 8, minAge: 18, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'free', totalAmount: 0, depositAmount: 0, balanceAmount: 0 },
    currentParticipants: 5,
    participantIds: ['user_3', 'user_5'],
    pendingIds: [],
    questions: [],
    createdAt: pastDate(3),
  },
  {
    id: 'act_5',
    title: '周末飞盘·新手友好局',
    description: '想试试飞盘运动？这是最适合新手的入门局！我们会从基础传盘开始教学，然后进行趣味对抗赛。不需要任何经验，只需要一双运动鞋和好心情。现场提供飞盘和饮用水。',
    cover: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['运动', '飞盘', '新手友好', '社交'],
    location: '上海市',
    locationDetail: '世纪公园大草坪',
    startTime: futureDate(2),
    endTime: futureDate(2),
    status: 'confirmed',
    accessRules: { maxParticipants: 24, minAge: 16, maxAge: 40, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'deposit', totalAmount: 39, depositAmount: 15, balanceAmount: 24 },
    currentParticipants: 20,
    participantIds: ['user_1', 'user_2', 'user_4', 'user_5'],
    pendingIds: [],
    questions: [
      { id: 'q4', userId: 'user_1', question: '下雨会取消吗？', answer: '小雨正常进行，大雨会提前2小时通知', isHighlighted: true, createdAt: pastDate(4) },
    ],
    createdAt: pastDate(14),
    groupQrCode: 'https://api.dicebear.com/7.x/identicon/svg?seed=group1',
  },
  {
    id: 'act_6',
    title: '旧物交换市集·给闲置一个新家',
    description: '带上你的闲置物品（衣物、书籍、小物件），来这里和大家交换吧！让旧物找到新主人，也给自己的生活添点新鲜感。现场还有手工改造workshop，教你把旧T恤变成环保袋。',
    cover: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800',
    ],
    hostId: 'host_1',
    coHostIds: ['host_2'],
    tags: ['环保', '市集', '手作', '社交'],
    location: '上海市',
    locationDetail: 'M50创意园·中庭广场',
    startTime: pastDate(5),
    endTime: pastDate(5),
    status: 'ended',
    accessRules: { maxParticipants: 50, minAge: 16, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'free', totalAmount: 0, depositAmount: 0, balanceAmount: 0 },
    currentParticipants: 38,
    participantIds: ['user_1', 'user_3', 'user_6'],
    pendingIds: [],
    questions: [],
    createdAt: pastDate(20),
  },
  {
    id: 'act_7',
    title: '陶艺体验·做一个属于自己的杯子',
    description: '在专业陶艺老师的指导下，从揉泥开始，亲手制作一个独一无二的陶瓷杯。包含烧制和上釉，2周后可取成品。适合零基础，适合一个人来安静地做手工。',
    cover: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    ],
    hostId: 'host_2',
    coHostIds: [],
    tags: ['手作', '陶艺', '文艺', '周末'],
    location: '上海市',
    locationDetail: '田子坊·陶艺工作室',
    startTime: futureDate(14),
    endTime: futureDate(14),
    status: 'published',
    accessRules: { maxParticipants: 6, minAge: 14, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'full', totalAmount: 198, depositAmount: 198, balanceAmount: 0 },
    currentParticipants: 4,
    participantIds: ['user_3', 'user_6'],
    pendingIds: [],
    questions: [],
    createdAt: pastDate(2),
  },
  {
    id: 'act_8',
    title: '城市摄影·外滩夜景拍摄',
    description: '带上相机或手机，和摄影爱好者一起拍外滩夜景。有摄影老师现场指导构图和参数设置，适合想提升摄影技术的朋友。活动结束后会建群分享照片，互相点评学习。',
    cover: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=600',
    images: [
      'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800',
    ],
    hostId: 'host_1',
    coHostIds: [],
    tags: ['摄影', '夜景', '学习', '城市探索'],
    location: '上海市',
    locationDetail: '外滩观景平台·信号塔下集合',
    startTime: futureDate(4),
    endTime: futureDate(4),
    status: 'published',
    accessRules: { maxParticipants: 12, minAge: 16, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'deposit', totalAmount: 59, depositAmount: 20, balanceAmount: 39 },
    currentParticipants: 9,
    participantIds: ['user_2', 'user_4'],
    pendingIds: [],
    questions: [],
    createdAt: pastDate(6),
  },
]

// 模拟报名数据
export const mockRegistrations: Registration[] = [
  {
    id: 'reg_1', activityId: 'act_5', userId: 'user_1', status: 'registered',
    paymentStatus: 'deposit_paid', depositAmount: 15, balanceAmount: 24,
    paidAt: pastDate(13), createdAt: pastDate(14),
  },
  {
    id: 'reg_2', activityId: 'act_6', userId: 'user_1', status: 'ended',
    paymentStatus: 'fully_paid', depositAmount: 0, balanceAmount: 0,
    paidAt: pastDate(19), createdAt: pastDate(19),
  },
  {
    id: 'reg_3', activityId: 'act_1', userId: 'user_1', status: 'registered',
    paymentStatus: 'authorized', depositAmount: 29, balanceAmount: 39,
    paidAt: pastDate(5), authorizedAt: pastDate(5), createdAt: pastDate(6),
  },
  {
    id: 'reg_4', activityId: 'act_2', userId: 'user_1', status: 'pending_payment',
    paymentStatus: 'unpaid', depositAmount: 128, balanceAmount: 0,
    createdAt: pastDate(1), paymentDeadline: futureDate(0),
  },
]

// 模拟评价数据
export const mockReviews: Review[] = [
  {
    id: 'rev_1', activityId: 'act_6', fromUserId: 'user_1', toUserId: 'host_1',
    rating: 5, tags: ['组织有序', '氛围好', '有趣'], comment: '非常棒的活动！主办方很用心，现场氛围特别好，认识了很多有趣的朋友。',
    createdAt: pastDate(4),
  },
  {
    id: 'rev_2', activityId: 'act_6', fromUserId: 'user_3', toUserId: 'host_1',
    rating: 5, tags: ['有趣', '值得参加'], comment: '旧物交换很有意义，手工改造也很有趣！',
    createdAt: pastDate(4),
  },
]

// 模拟优惠券数据
export const mockCoupons: Coupon[] = [
  {
    id: 'cpn_1', userId: 'user_1', amount: 5, minAmount: 0,
    description: '5元无门槛活动券', source: '活动取消补偿',
    expiresAt: futureDate(30), isUsed: false, createdAt: pastDate(10),
  },
  {
    id: 'cpn_2', userId: 'user_1', amount: 10, minAmount: 50,
    description: '满50减10活动券', source: '新用户福利',
    expiresAt: futureDate(60), isUsed: false, createdAt: pastDate(20),
  },
  {
    id: 'cpn_3', userId: 'user_1', amount: 5, minAmount: 0,
    description: '5元无门槛活动券', source: '活动取消补偿',
    expiresAt: pastDate(2), isUsed: true, usedAt: pastDate(5), createdAt: pastDate(30),
  },
]

// 模拟钱包数据
export const mockWallet: Wallet = {
  hostId: 'host_1',
  frozen: 580,
  pending: 320,
  available: 1250,
  totalEarnings: 8500,
}

// 模拟钱包明细
export const mockWalletTransactions: WalletTransaction[] = [
  { id: 'wt_1', hostId: 'host_1', type: 'deposit', amount: 290, description: '活动「城市摄影」留位费入账', activityId: 'act_8', createdAt: pastDate(6) },
  { id: 'wt_2', hostId: 'host_1', type: 'settle', amount: 650, description: '活动「旧物交换市集」结算', activityId: 'act_6', createdAt: pastDate(4) },
  { id: 'wt_3', hostId: 'host_1', type: 'withdraw', amount: -500, description: '提现到支付宝', createdAt: pastDate(10) },
  { id: 'wt_4', hostId: 'host_1', type: 'refund', amount: -39, description: '活动取消退款·用户xxx', createdAt: pastDate(15) },
]

// 模拟通知数据
export const mockNotifications: Notification[] = [
  {
    id: 'noti_1', userId: 'user_1', type: 'activity_change',
    title: '活动已成行', content: '你参加的「周末飞盘·新手友好局」已确认成行，快去看看群二维码吧！',
    isRead: false, linkTo: '/activity/act_5', createdAt: pastDate(1),
  },
  {
    id: 'noti_2', userId: 'user_1', type: 'payment',
    title: '待支付提醒', content: '你报名的「DIY干花香薰蜡烛」还未完成支付，15分钟内未支付将自动取消哦～',
    isRead: false, linkTo: '/activity/act_2', createdAt: pastDate(1),
  },
  {
    id: 'noti_3', userId: 'user_1', type: 'registration',
    title: '报名成功', content: '你已成功报名「城市夜骑」，留位费 ¥29 已支付',
    isRead: true, linkTo: '/activity/act_1', createdAt: pastDate(6),
  },
  {
    id: 'noti_4', userId: 'user_1', type: 'refund',
    title: '退款到账', content: '活动「xxx」已取消，留位费已原路退回，补偿券已发放到你的账户',
    isRead: true, createdAt: pastDate(10),
  },
]

// 模拟徽章数据
export const mockBadges: Badge[] = [
  { id: 'b1', name: '初来乍到', icon: '🌟', description: '完成第一次活动报名', earnedAt: pastDate(20) },
  { id: 'b2', name: '社交达人', icon: '🎉', description: '参加10场活动', earnedAt: pastDate(5) },
  { id: 'b3', name: '周末战士', icon: '⚡', description: '连续4个周末参加活动', earnedAt: pastDate(3) },
  { id: 'b4', name: '五星好评', icon: '⭐', description: '获得5条5星评价', earnedAt: pastDate(2) },
]

// 所有用户（合并）
export const allUsers: User[] = [currentUser, ...hosts, ...participants]

// 根据ID查找用户
export function getUserById(id: string): User | undefined {
  return allUsers.find(u => u.id === id)
}

// 根据ID查找活动
export function getActivityById(id: string): Activity | undefined {
  return mockActivities.find(a => a.id === id)
}
