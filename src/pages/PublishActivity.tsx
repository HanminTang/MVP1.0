import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useActivityStore } from '../store/activityStore'
import { useUserStore } from '../store/userStore'
import { useToast } from '../components/Toast'
import { generateId } from '../utils'
import type { Activity, FeeType, JoinMethod } from '../types'

export default function PublishActivity() {
  const navigate = useNavigate()
  const { addActivity } = useActivityStore()
  const { currentUser } = useUserStore()
  const { show } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [locationDetail, setLocationDetail] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(10)
  const [minAge, setMinAge] = useState<number | ''>('')
  const [maxAge, setMaxAge] = useState<number | ''>('')
  const [genderLimit, setGenderLimit] = useState<'all' | 'male' | 'female'>('all')
  const [joinMethod, setJoinMethod] = useState<JoinMethod>('auto')
  const [feeType, setFeeType] = useState<FeeType>('free')
  const [totalAmount, setTotalAmount] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)
  const [balanceAmount, setBalanceAmount] = useState(0)

  const allTags = ['运动', '手作', '文艺', '户外', '社交', '美食', '音乐', '摄影', '读书', '咖啡', '骑行', '徒步', '飞盘', '周末']

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  const handleSubmit = () => {
    if (!title.trim()) { show('请输入活动标题', 'error'); return }
    if (!description.trim()) { show('请输入活动描述', 'error'); return }
    if (!startTime) { show('请选择开始时间', 'error'); return }
    if (!location.trim()) { show('请输入活动地点', 'error'); return }
    if (tags.length === 0) { show('请至少选择一个标签', 'error'); return }

    const activity: Activity = {
      id: generateId('act'),
      title: title.trim(),
      description: description.trim(),
      cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600',
      images: [],
      hostId: currentUser.id,
      coHostIds: [],
      tags,
      location: location.trim(),
      locationDetail: locationDetail.trim(),
      startTime: new Date(startTime).toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : new Date(startTime).toISOString(),
      status: 'published',
      accessRules: {
        maxParticipants,
        minAge: minAge || undefined,
        maxAge: maxAge || undefined,
        genderLimit,
        joinMethod,
      },
      fee: {
        type: feeType,
        totalAmount: feeType === 'full' ? totalAmount : depositAmount + balanceAmount,
        depositAmount: feeType === 'free' ? 0 : depositAmount,
        balanceAmount: feeType === 'deposit' ? balanceAmount : 0,
      },
      currentParticipants: 0,
      participantIds: [],
      pendingIds: [],
      questions: [],
      createdAt: new Date().toISOString(),
    }

    addActivity(activity)
    show('活动发布成功！', 'success')
    navigate('/host/manage')
  }

  return (
    <Layout title="发布活动" showBack>
      <div className="px-4 py-4 space-y-6 pb-24">
        {/* 基础信息 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">基础信息</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">活动标题</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给活动起个有趣的名字"
                maxLength={30}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <div className="text-right text-[10px] text-gray-300 mt-0.5">{title.length}/30</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">活动描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="详细介绍一下活动内容、注意事项等"
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block">标签（可多选）</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      tags.includes(tag)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 text-gray-500 active:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 时间地点 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">时间地点</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">开始时间</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">结束时间</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">活动城市</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="如：上海市"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">详细地址</label>
              <input
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="具体集合地点"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </section>

        {/* 准入条件 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">准入条件</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">人数上限</label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                min={2}
                max={200}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">最小年龄</label>
                <input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="不限"
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">最大年龄</label>
                <input
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="不限"
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">性别限制</label>
              <div className="flex gap-2">
                {[
                  { value: 'all' as const, label: '不限' },
                  { value: 'male' as const, label: '仅男生' },
                  { value: 'female' as const, label: '仅女生' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGenderLimit(opt.value)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                      genderLimit === opt.value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">加入方式</label>
              <div className="flex gap-2">
                {[
                  { value: 'auto' as const, label: '自动加入' },
                  { value: 'approval' as const, label: '需审批' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setJoinMethod(opt.value)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                      joinMethod === opt.value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 费用设置 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">费用设置</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {[
                { value: 'free' as const, label: '免费' },
                { value: 'full' as const, label: '全款' },
                { value: 'deposit' as const, label: '留位费+尾款' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFeeType(opt.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    feeType === opt.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {feeType === 'full' && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">总费用（元）</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}
            {feeType === 'deposit' && (
              <>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">留位费（元）- 实付</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">尾款（元）- 预授权冻结</label>
                  <input
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-600 leading-relaxed">
                  <p>留位费实付后进入平台托管，尾款活动结束后自动扣款</p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleSubmit}
          className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-indigo-500 active:bg-indigo-600 transition-colors"
        >
          发布活动
        </button>
      </div>
    </Layout>
  )
}
