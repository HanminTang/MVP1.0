# 趣集 - 同城兴趣活动平台

面向年轻人的同城兴趣活动平台MVP Demo，主打低门槛、透明无套路、极简体验。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式方案**: Tailwind CSS 4
- **状态管理**: Zustand (with localStorage persistence)
- **路由**: React Router 7
- **日期处理**: date-fns

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器默认运行在 `http://localhost:3000`，优先适配移动端（375px宽度）。

## 项目结构

```
src/
├── types/           # TypeScript 类型定义
│   └── index.ts
├── mock/            # 模拟数据
│   └── data.ts
├── store/           # Zustand 状态管理
│   ├── userStore.ts      # 用户、通知、优惠券状态
│   ├── activityStore.ts  # 活动、收藏状态
│   ├── orderStore.ts     # 报名/订单状态
│   └── walletStore.ts    # 钱包、评价状态
├── utils/           # 工具函数
│   └── index.ts
├── components/      # 通用组件
│   ├── Layout.tsx        # 页面布局（标题栏、返回按钮、消息入口）
│   ├── TabBar.tsx        # 底部导航栏（C端/B端自适应）
│   ├── ActivityCard.tsx  # 活动卡片组件
│   ├── Modal.tsx         # 底部弹窗 & 确认对话框
│   ├── Toast.tsx         # 全局提示组件
│   └── EmptyState.tsx    # 空状态组件
├── pages/           # 页面组件
│   ├── Home.tsx              # 首页 - 活动发现与列表
│   ├── ActivityDetail.tsx    # 活动详情页
│   ├── RegisterPay.tsx       # 报名与支付模拟流程
│   ├── MyOrders.tsx          # 我的报名管理
│   ├── OrderDetail.tsx       # 报名详情页
│   ├── Timeline.tsx          # 活动生涯时间轴
│   ├── Reviews.tsx           # 双向互评管理
│   ├── Profile.tsx           # 个人中心
│   ├── PublishActivity.tsx   # B端 - 发布活动
│   ├── ManageActivity.tsx    # B端 - 活动管理
│   ├── HostWallet.tsx        # B端 - 钱包管理
│   ├── UserProfile.tsx       # 用户主页
│   ├── Messages.tsx          # 消息通知
│   └── Coupons.tsx           # 优惠券管理
├── App.tsx          # 路由配置
├── main.tsx         # 应用入口
└── index.css        # 全局样式
```

## 核心功能

### C端用户
- **活动发现**: 搜索、标签筛选、热门推荐
- **活动详情**: 完整信息展示、主办方信息、准入条件、费用说明、问答留言
- **报名支付**: 三种费用模式（免费/全款/留位费+预授权），模拟支付流程
- **订单管理**: 按状态分类查看，取消报名（区分24h规则）
- **活动生涯**: 月度时间轴、里程碑徽章
- **双向互评**: 5星评分 + 标签评价
- **个人中心**: 聚合所有入口，C/B端角色切换

### B端主办方
- **活动发布**: 基础信息、准入条件、费用设置
- **活动管理**: 状态筛选、取消活动（含退款规则提示）
- **钱包管理**: 冻结/待结算/可提现金额，交易明细，模拟提现

### 公共模块
- **用户主页**: 基础信息、标签、活动记录、评分
- **消息通知**: 分类通知，未读标记
- **优惠券**: 可用/已使用/已过期分类

## 核心业务规则

### 支付模式
- **免费活动**: 无需支付
- **全款支付**: 一次性支付全部费用
- **留位费 + 尾款预授权**: 留位费实付进入平台托管，尾款预授权冻结，活动结束后自动扣款

### 退款规则
- 用户活动前≥24h取消：留位费全额退款，尾款预授权立即解冻
- 用户活动前<24h取消/爽约：留位费不予退还，尾款预授权解冻
- 主办方取消：全额退款 + 解冻 + 发放5元无门槛补偿券

### 活动状态流转
```
待审核 → 已发布 → 已成行 → 已结束/已取消
```

### 报名状态流转
```
待审批/待支付 → 已报名 → 已参与/已取消
```

## 数据持久化

所有状态通过 Zustand 的 `persist` 中间件存储在 localStorage 中，刷新页面不丢失数据。

## 后续扩展

本MVP为后续微信小程序版本预留了扩展点：
- 所有模拟数据在 `mock/data.ts` 中集中管理，对接真实API时只需替换数据源
- 业务逻辑（退款规则、状态流转）在 store 中实现，可直接复用
- 组件化设计，UI层与业务逻辑解耦
