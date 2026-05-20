import type { User, Activity, Registration, Review, Coupon, Wallet, WalletTransaction, Notification, Badge } from '../types'

// ===== 扬州大学校园活动平台模拟数据 =====

// 当前模拟用户（C端）
export const currentUser: User = {
  id: 'user_1',
  nickname: '林小晚',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linxiaowan',
  role: 'user',
  gender: 'female',
  age: 21,
  bio: '文学院大三，喜欢读书和散步，想认识更多有趣的人～',
  tags: ['读书', '摄影', '散步', '咖啡'],
  hostedCount: 3,
  joinedCount: 28,
  rating: 4.8,
  ratingCount: 15,
  createdAt: '2025-09-01',
  grade: '大三',
  major: '汉语言文学',
  realNameVerified: true,
  studentVerified: true,
}

// 模拟B端主办方用户（社团负责人/活动发起人）
export const hosts: User[] = [
  {
    id: 'host_1',
    nickname: '陈启明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenqm',
    role: 'host',
    gender: 'male',
    age: 22,
    bio: '校摄影社社长，用镜头记录扬大四季｜已举办50+场校园活动',
    tags: ['摄影', '城市探索', '文化'],
    hostedCount: 52,
    joinedCount: 12,
    rating: 4.9,
    ratingCount: 230,
    createdAt: '2024-03-10',
    grade: '大四',
    major: '视觉传达设计',
    realNameVerified: true,
    studentVerified: true,
  },
  {
    id: 'host_2',
    nickname: '苏雨桐',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suyutong',
    role: 'host',
    gender: 'female',
    age: 21,
    bio: '手工社副社长，带你体验各种有趣的手作课程',
    tags: ['手作', '烘焙', '花艺'],
    hostedCount: 35,
    joinedCount: 8,
    rating: 4.7,
    ratingCount: 156,
    createdAt: '2024-06-20',
    grade: '大三',
    major: '美术学',
    realNameVerified: true,
    studentVerified: true,
  },
  {
    id: 'host_3',
    nickname: '王浩然',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wanghr',
    role: 'host',
    gender: 'male',
    age: 22,
    bio: '校飞盘队队长，周末一起出汗！',
    tags: ['飞盘', '骑行', '徒步', '篮球'],
    hostedCount: 68,
    joinedCount: 20,
    rating: 4.8,
    ratingCount: 312,
    createdAt: '2024-01-05',
    grade: '大四',
    major: '体育教育',
    realNameVerified: true,
    studentVerified: true,
  },
]

// 模拟其他参与者
export const participants: User[] = [
  {
    id: 'user_2', nickname: '周远航', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouyh',
    role: 'user', gender: 'male', age: 20, bio: '大二工科生，爱好运动', tags: ['飞盘', '篮球', '摄影'],
    hostedCount: 0, joinedCount: 15, rating: 4.5, ratingCount: 8, createdAt: '2025-09-01',
    grade: '大二', major: '机械工程', realNameVerified: true, studentVerified: true,
  },
  {
    id: 'user_3', nickname: '张诗涵', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsh',
    role: 'user', gender: 'female', age: 21, bio: '咖啡重度爱好者，周末不出门会死星人', tags: ['咖啡', '读书', '手作'],
    hostedCount: 1, joinedCount: 22, rating: 4.9, ratingCount: 12, createdAt: '2025-09-01',
    grade: '大三', major: '英语', realNameVerified: true, studentVerified: true,
  },
  {
    id: 'user_4', nickname: '李梦琪', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=limq',
    role: 'user', gender: 'female', age: 20, bio: '旅行博主预备选手，扬大在读', tags: ['旅行', '摄影', '徒步'],
    hostedCount: 0, joinedCount: 18, rating: 4.6, ratingCount: 10, createdAt: '2025-09-01',
    grade: '大二', major: '新闻学', realNameVerified: true, studentVerified: true,
  },
  {
    id: 'user_5', nickname: '赵宇轩', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoyx',
    role: 'user', gender: 'male', age: 23, bio: '研一，周末想多出去走走', tags: ['徒步', '读书', '电影'],
    hostedCount: 2, joinedCount: 30, rating: 4.7, ratingCount: 18, createdAt: '2025-09-01',
    grade: '研一', major: '计算机科学与技术', realNameVerified: true, studentVerified: true,
  },
  {
    id: 'user_6', nickname: '刘芷萱', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuzx',
    role: 'user', gender: 'female', age: 21, bio: '花艺设计师，园艺社成员', tags: ['花艺', '手作', '烘焙'],
    hostedCount: 0, joinedCount: 25, rating: 4.8, ratingCount: 14, createdAt: '2025-09-01',
    grade: '大三', major: '园艺', realNameVerified: true, studentVerified: true,
  },
]

// 日期工具
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

// 校园活动图片（Unsplash 可正常显示的校园/青年活动图）
const CAMPUS_IMAGES = {
  photography: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
  hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
  frisbee: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600',
  reading: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
  handmade: 'https://images.unsplash.com/photo-1602607439100-adf44914c3c0?w=600',
  cycling: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600',
  pottery: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
  market: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600',
  sunset: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=600',
  running: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600',
  music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600',
  volunteer: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600',
  debate: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  calligraphy: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
  movie: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
  football: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600',
}

// 模拟活动数据（扬州大学校园活动）
export const mockActivities: Activity[] = [
  {
    id: 'act_1',
    title: '校园夜骑·骑行探索扬州古城夜色',
    description: '一起骑上单车，从瘦西湖校区出发，穿过东关街、文昌阁，感受扬州古城夜晚的独特魅力。路线经过3个打卡点，全程约12km，难度适中，新手友好。校骑行社统一提供头盔和骑行灯！',
    cover: CAMPUS_IMAGES.cycling,
    images: [CAMPUS_IMAGES.cycling, CAMPUS_IMAGES.sunset],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['运动', '骑行', '夜生活', '社团活动'],
    location: '扬州市',
    locationDetail: '瘦西湖校区南门集合',
    startTime: futureDate(3),
    endTime: futureDate(3),
    status: 'published',
    accessRules: { maxParticipants: 20, minAge: 18, maxAge: 26, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'deposit', totalAmount: 15, depositAmount: 5, balanceAmount: 10 },
    currentParticipants: 12,
    participantIds: ['user_2', 'user_4', 'user_5'],
    pendingIds: [],
    questions: [
      { id: 'q1', userId: 'user_2', question: '需要自己带车吗？', answer: '不用哦，社团统一提供～', isHighlighted: true, createdAt: pastDate(2) },
      { id: 'q2', userId: 'user_4', question: '下雨怎么办？', answer: '活动前一天群内通知是否延期', isHighlighted: false, createdAt: pastDate(1) },
    ],
    createdAt: pastDate(7),
  },
  {
    id: 'act_2',
    title: '周五晚足球6v6·校内友谊赛',
    description: '扬大足球爱好者集合！每周五晚在扬子津校区田径场组织6v6友谊赛，随机分组对抗。不限水平，新手老手都欢迎。自带球鞋，提供比赛用球和分队背心。踢完一起去北门撸串！',
    cover: CAMPUS_IMAGES.football,
    images: [CAMPUS_IMAGES.football],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['运动', '足球', '社交', '学生自发'],
    location: '扬州市',
    locationDetail: '扬子津校区田径场',
    startTime: futureDate(5),
    endTime: futureDate(5),
    status: 'published',
    accessRules: { maxParticipants: 14, minAge: 18, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'free', totalAmount: 0, depositAmount: 0, balanceAmount: 0 },
    currentParticipants: 10,
    participantIds: ['user_2', 'user_5', 'user_4'],
    pendingIds: [],
    questions: [
      { id: 'q3', userId: 'user_2', question: '需要自己带球鞋吗？', answer: '是的～穿碎钉或AG就行，场地是人工草', isHighlighted: true, createdAt: pastDate(3) },
      { id: 'q3b', userId: 'user_5', question: '女生可以参加吗？', answer: '当然！我们有不少女生一起踢，氛围很好', isHighlighted: true, createdAt: pastDate(2) },
    ],
    createdAt: pastDate(10),
  },
  {
    id: 'act_3',
    title: '晨间徒步·登蜀冈看日出',
    description: '凌晨5点集合，一起徒步登顶蜀冈，迎接第一缕阳光。登顶后在平山堂分享早餐，拍最美的日出照片。全程约3km，难度较低。提供早餐和热饮，你需要准备舒适的鞋子。',
    cover: CAMPUS_IMAGES.hiking,
    images: [CAMPUS_IMAGES.hiking],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['户外', '徒步', '日出', '自然'],
    location: '扬州市',
    locationDetail: '瘦西湖校区西门集合',
    startTime: futureDate(7),
    endTime: futureDate(7),
    status: 'published',
    accessRules: { maxParticipants: 15, minAge: 18, maxAge: 26, genderLimit: 'all', joinMethod: 'approval' },
    fee: { type: 'deposit', totalAmount: 10, depositAmount: 3, balanceAmount: 7 },
    currentParticipants: 10,
    participantIds: ['user_2', 'user_5'],
    pendingIds: ['user_4'],
    questions: [],
    createdAt: pastDate(5),
  },
  {
    id: 'act_4',
    title: '读书沙龙·聊聊最近在读的那本书',
    description: '带上你最近在读的一本书，和5-8个同学围坐在校区咖啡厅，分享阅读感受。没有固定书目限制，小说、散文、专业书都可以。提供手冲咖啡和小点心，轻松自在。',
    cover: CAMPUS_IMAGES.reading,
    images: [CAMPUS_IMAGES.reading],
    hostId: 'host_1',
    coHostIds: [],
    tags: ['读书', '社交', '文艺', '咖啡'],
    location: '扬州市',
    locationDetail: '文汇路校区·梧桐咖啡',
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
    description: '想试试飞盘运动？这是最适合新手的入门局！校飞盘队学长从基础传盘开始教学，然后进行趣味对抗赛。不需要任何经验，只需要一双运动鞋和好心情。',
    cover: CAMPUS_IMAGES.frisbee,
    images: [CAMPUS_IMAGES.frisbee],
    hostId: 'host_3',
    coHostIds: [],
    tags: ['运动', '飞盘', '新手友好', '社交'],
    location: '扬州市',
    locationDetail: '扬子津校区田径场',
    startTime: futureDate(2),
    endTime: futureDate(2),
    status: 'confirmed',
    accessRules: { maxParticipants: 24, minAge: 18, maxAge: 26, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'free', totalAmount: 0, depositAmount: 0, balanceAmount: 0 },
    currentParticipants: 20,
    participantIds: ['user_1', 'user_2', 'user_4', 'user_5'],
    pendingIds: [],
    questions: [
      { id: 'q4', userId: 'user_1', question: '下雨会取消吗？', answer: '小雨正常进行，大雨提前2小时群内通知', isHighlighted: true, createdAt: pastDate(4) },
    ],
    createdAt: pastDate(14),
    groupQrCode: 'https://api.dicebear.com/7.x/identicon/svg?seed=group1',
  },
  {
    id: 'act_6',
    title: '旧物交换市集·给闲置一个新家',
    description: '带上你的闲置物品（衣物、书籍、小物件），来这里和大家交换吧！让旧物找到新主人。现场还有手工改造workshop，教你把旧T恤变成环保袋。校环保社主办。',
    cover: CAMPUS_IMAGES.market,
    images: [CAMPUS_IMAGES.market],
    hostId: 'host_1',
    coHostIds: ['host_2'],
    tags: ['环保', '市集', '手作', '社团活动'],
    location: '扬州市',
    locationDetail: '荷花池校区·大学生活动中心广场',
    startTime: pastDate(5),
    endTime: pastDate(5),
    status: 'ended',
    accessRules: { maxParticipants: 50, minAge: 18, genderLimit: 'all', joinMethod: 'auto' },
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
    description: '在手工社陶艺教室，从揉泥开始，亲手制作一个独一无二的陶瓷杯。包含烧制和上釉，2周后可取成品。适合零基础，适合一个人来安静地做手工。',
    cover: CAMPUS_IMAGES.pottery,
    images: [CAMPUS_IMAGES.pottery],
    hostId: 'host_2',
    coHostIds: [],
    tags: ['手作', '陶艺', '文艺', '社团活动'],
    location: '扬州市',
    locationDetail: '瘦西湖校区·手工社陶艺教室',
    startTime: futureDate(14),
    endTime: futureDate(14),
    status: 'published',
    accessRules: { maxParticipants: 6, minAge: 18, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'full', totalAmount: 35, depositAmount: 35, balanceAmount: 0 },
    currentParticipants: 4,
    participantIds: ['user_3', 'user_6'],
    pendingIds: [],
    questions: [],
    createdAt: pastDate(2),
  },
  {
    id: 'act_8',
    title: '摄影社·瘦西湖落日拍摄',
    description: '带上相机或手机，和摄影社一起拍瘦西湖落日。有学长现场指导构图和参数设置，适合想提升摄影技术的同学。活动结束后建群分享照片，互相点评学习。',
    cover: CAMPUS_IMAGES.sunset,
    images: [CAMPUS_IMAGES.sunset],
    hostId: 'host_1',
    coHostIds: [],
    tags: ['摄影', '落日', '学习', '社团活动'],
    location: '扬州市',
    locationDetail: '瘦西湖校区东门集合，步行至瘦西湖',
    startTime: futureDate(4),
    endTime: futureDate(4),
    status: 'published',
    accessRules: { maxParticipants: 12, minAge: 18, genderLimit: 'all', joinMethod: 'auto' },
    fee: { type: 'free', totalAmount: 0, depositAmount: 0, balanceAmount: 0 },
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
    paymentStatus: 'fully_paid', depositAmount: 0, balanceAmount: 0,
    paidAt: pastDate(13), createdAt: pastDate(14),
  },
  {
    id: 'reg_2', activityId: 'act_6', userId: 'user_1', status: 'ended',
    paymentStatus: 'fully_paid', depositAmount: 0, balanceAmount: 0,
    paidAt: pastDate(19), createdAt: pastDate(19),
  },
  {
    id: 'reg_3', activityId: 'act_1', userId: 'user_1', status: 'registered',
    paymentStatus: 'authorized', depositAmount: 5, balanceAmount: 10,
    paidAt: pastDate(5), authorizedAt: pastDate(5), createdAt: pastDate(6),
  },
  {
    id: 'reg_4', activityId: 'act_7', userId: 'user_1', status: 'pending_payment',
    paymentStatus: 'unpaid', depositAmount: 35, balanceAmount: 0,
    createdAt: pastDate(1), paymentDeadline: futureDate(0),
  },
]

// 模拟评价数据（丰富评价，覆盖所有主办方和用户）
export const mockReviews: Review[] = [
  // host_1 陈启明 的评价
  { id: 'rev_1', activityId: 'act_6', fromUserId: 'user_1', toUserId: 'host_1', rating: 5, tags: ['组织有序', '氛围好', '有趣'], comment: '市集活动超棒！陈学长组织得很用心，现场氛围特别好，认识了好几个其他学院的朋友。', createdAt: pastDate(4) },
  { id: 'rev_2', activityId: 'act_6', fromUserId: 'user_3', toUserId: 'host_1', rating: 5, tags: ['有趣', '值得参加'], comment: '旧物交换很有意义，手工改造也很有趣！下次还想来。', createdAt: pastDate(4) },
  { id: 'rev_3', activityId: 'act_4', fromUserId: 'user_5', toUserId: 'host_1', rating: 4, tags: ['氛围好', '有深度'], comment: '读书沙龙很有意思，认识了几个同好，咖啡也不错～', createdAt: pastDate(8) },
  { id: 'rev_4', activityId: 'act_8', fromUserId: 'user_2', toUserId: 'host_1', rating: 5, tags: ['专业', '耐心指导', '学到很多'], comment: '摄影社学长讲解很详细，学到了好多构图技巧！', createdAt: pastDate(12) },
  { id: 'rev_5', activityId: 'act_8', fromUserId: 'user_4', toUserId: 'host_1', rating: 4, tags: ['拍照好看', '组织好'], comment: '瘦西湖落日太美了，学长帮忙拍的照片也很好看！', createdAt: pastDate(12) },
  { id: 'rev_6', activityId: 'act_6', fromUserId: 'user_6', toUserId: 'host_1', rating: 5, tags: ['环保', '有创意', '氛围好'], comment: '超喜欢这种环保理念的活动！旧T恤改环保袋超实用。', createdAt: pastDate(3) },
  // host_2 苏雨桐 的评价
  { id: 'rev_7', activityId: 'act_2', fromUserId: 'user_2', toUserId: 'host_3', rating: 5, tags: ['氛围好', '组队快', '好玩'], comment: '6v6踢得很过瘾！分组很均匀，新手也能玩得开心，结束后撸串也很赞。', createdAt: pastDate(15) },
  { id: 'rev_8', activityId: 'act_2', fromUserId: 'user_4', toUserId: 'host_3', rating: 4, tags: ['组织好', '社交'], comment: '虽然不太会踢但大家很包容，认识了几个经院的朋友～', createdAt: pastDate(14) },
  { id: 'rev_9', activityId: 'act_7', fromUserId: 'user_3', toUserId: 'host_2', rating: 4, tags: ['有趣', '耐心'], comment: '陶艺体验很治愈，虽然做得不太完美但过程很开心～', createdAt: pastDate(20) },
  { id: 'rev_10', activityId: 'act_7', fromUserId: 'user_6', toUserId: 'host_2', rating: 5, tags: ['放松', '有成就感'], comment: '第一次做陶艺，没想到效果还不错！期待两周后取成品。', createdAt: pastDate(19) },
  // host_3 王浩然 的评价
  { id: 'rev_11', activityId: 'act_5', fromUserId: 'user_1', toUserId: 'host_3', rating: 5, tags: ['新手友好', '氛围好', '有趣'], comment: '第一次玩飞盘，王学长教得特别耐心，氛围超好，出了一身汗但很开心！', createdAt: pastDate(10) },
  { id: 'rev_12', activityId: 'act_5', fromUserId: 'user_2', toUserId: 'host_3', rating: 5, tags: ['运动达人', '组织好', '会带动气氛'], comment: '浩然学长带的飞盘局太好玩了！下周继续！', createdAt: pastDate(9) },
  { id: 'rev_13', activityId: 'act_1', fromUserId: 'user_4', toUserId: 'host_3', rating: 4, tags: ['路线好', '有安全感'], comment: '夜骑路线很棒，经过东关街那段特别有感觉。', createdAt: pastDate(25) },
  { id: 'rev_14', activityId: 'act_1', fromUserId: 'user_5', toUserId: 'host_3', rating: 5, tags: ['装备齐全', '专业'], comment: '头盔骑行灯都准备好了，路线规划也很合理，推荐！', createdAt: pastDate(24) },
  { id: 'rev_15', activityId: 'act_3', fromUserId: 'user_2', toUserId: 'host_3', rating: 5, tags: ['难忘体验', '日出很美'], comment: '虽然凌晨5点很困，但在蜀冈看到日出的那一刻觉得值了！早餐也很好吃。', createdAt: pastDate(18) },
  { id: 'rev_16', activityId: 'act_3', fromUserId: 'user_5', toUserId: 'host_3', rating: 4, tags: ['户外体验好', '自然'], comment: '徒步强度适中，平山堂风景很好，是一次不错的体验。', createdAt: pastDate(17) },
  { id: 'rev_20', activityId: 'act_5', fromUserId: 'user_4', toUserId: 'host_3', rating: 5, tags: ['社交', '好玩'], comment: '认识了好多其他专业的同学，飞盘真的很上瘾！', createdAt: pastDate(8) },
]

// 模拟优惠券数据
export const mockCoupons: Coupon[] = [
  {
    id: 'cpn_1', userId: 'user_1', amount: 5, minAmount: 0,
    description: '5元无门槛活动券', source: '活动取消补偿',
    expiresAt: futureDate(30), isUsed: false, createdAt: pastDate(10),
  },
  {
    id: 'cpn_2', userId: 'user_1', amount: 10, minAmount: 30,
    description: '满30减10活动券', source: '新生福利',
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
  frozen: 50,
  pending: 30,
  available: 120,
  totalEarnings: 850,
}

// 模拟钱包明细
export const mockWalletTransactions: WalletTransaction[] = [
  { id: 'wt_1', hostId: 'host_1', type: 'deposit', amount: 45, description: '活动「瘦西湖落日拍摄」费用入账', activityId: 'act_8', createdAt: pastDate(6) },
  { id: 'wt_2', hostId: 'host_1', type: 'settle', amount: 120, description: '活动「旧物交换市集」结算', activityId: 'act_6', createdAt: pastDate(4) },
  { id: 'wt_3', hostId: 'host_1', type: 'withdraw', amount: -100, description: '提现到支付宝', createdAt: pastDate(10) },
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
    title: '待支付提醒', content: '你报名的「陶艺体验·做一个属于自己的杯子」还未完成支付，15分钟内未支付将自动取消哦～',
    isRead: false, linkTo: '/activity/act_2', createdAt: pastDate(1),
  },
  {
    id: 'noti_3', userId: 'user_1', type: 'registration',
    title: '报名成功', content: '你已成功报名「校园夜骑」，留位费 ¥5 已支付',
    isRead: true, linkTo: '/activity/act_1', createdAt: pastDate(6),
  },
  {
    id: 'noti_4', userId: 'user_1', type: 'system',
    title: '学生认证通过', content: '恭喜！你的扬州大学学生认证已通过审核，可参加校内活动啦～',
    isRead: true, createdAt: pastDate(30),
  },
]

// 模拟徽章数据
export const mockBadges: Badge[] = [
  { id: 'b1', name: '初来乍到', icon: '🌟', description: '完成第一次活动报名', earnedAt: pastDate(20) },
  { id: 'b2', name: '社交达人', icon: '🎉', description: '参加10场活动', earnedAt: pastDate(5) },
  { id: 'b3', name: '周末战士', icon: '⚡', description: '连续4个周末参加活动', earnedAt: pastDate(3) },
  { id: 'b4', name: '五星好评', icon: '⭐', description: '获得5条5星评价', earnedAt: pastDate(2) },
  { id: 'b5', name: '扬大之星', icon: '🎓', description: '学生认证+实名认证双通过', earnedAt: pastDate(29) },
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
