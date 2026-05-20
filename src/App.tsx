import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { TabBar } from './components/TabBar'

// C端页面
import Home from './pages/Home'
import ActivityDetail from './pages/ActivityDetail'
import RegisterPay from './pages/RegisterPay'
import MyOrders from './pages/MyOrders'
import OrderDetail from './pages/OrderDetail'
import Timeline from './pages/Timeline'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'

// B端页面
import PublishActivity from './pages/PublishActivity'
import ManageActivity from './pages/ManageActivity'
import HostWallet from './pages/HostWallet'

// 公共页面
import UserProfile from './pages/UserProfile'
import Messages from './pages/Messages'
import Coupons from './pages/Coupons'

export default function App() {
  return (
    <>
      <Routes>
        {/* C端核心路由 */}
        <Route path="/" element={<Home />} />
        <Route path="/activity/:id" element={<ActivityDetail />} />
        <Route path="/register/:id" element={<RegisterPay />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<Profile />} />

        {/* B端路由 */}
        <Route path="/host/publish" element={<PublishActivity />} />
        <Route path="/host/manage" element={<ManageActivity />} />
        <Route path="/host/wallet" element={<HostWallet />} />

        {/* 公共路由 */}
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/coupons" element={<Coupons />} />

        {/* 兜底 */}
        <Route path="*" element={<Home />} />
      </Routes>
      <TabBar />
    </>
  )
}
