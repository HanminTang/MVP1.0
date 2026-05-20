import React, { useState, useMemo } from 'react'
import { useActivityStore } from '../store/activityStore'
import { ActivityCard } from '../components/ActivityCard'
import { Layout } from '../components/Layout'

const TAGS = ['热门', '运动', '手作', '文艺', '户外', '社交', '美食', '音乐']

export function Home() {
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('热门')

  const activities = useActivityStore((s) => s.activities)

  // Build a quick lookup set for "热门" to match tags from the filter bar
  const hotTagMap: Record<string, string[]> = useMemo(
    () => ({
      运动: ['运动', '骑行', '飞盘', '徒步', '攀岩'],
      手作: ['手作', '陶艺', '花艺', '烘焙'],
      文艺: ['文艺', '读书', '摄影', '电影'],
      户外: ['户外', '徒步', '自然', '露营', '骑行'],
      社交: ['社交', '城市探索', '周末'],
      美食: ['美食', '咖啡', '烘焙'],
      音乐: ['音乐'],
    }),
    [],
  )

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      // Only show published or confirmed
      if (a.status !== 'published' && a.status !== 'confirmed') return false

      // Search filter
      if (searchText) {
        const lower = searchText.toLowerCase()
        const matchesTitle = a.title.toLowerCase().includes(lower)
        const matchesDesc = a.description.toLowerCase().includes(lower)
        const matchesLocation = a.location.toLowerCase().includes(lower)
        const matchesTags = a.tags.some((t) => t.toLowerCase().includes(lower))
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesTags) return false
      }

      // Tag filter (热门 shows all)
      if (selectedTag !== '热门') {
        const relatedTags = hotTagMap[selectedTag] || [selectedTag]
        const hasMatchingTag = a.tags.some((t) => relatedTags.includes(t))
        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [activities, searchText, selectedTag, hotTagMap])

  // Hot recommendations: first 5 published activities sorted by participants desc
  const hotActivities = useMemo(() => {
    return activities
      .filter((a) => a.status === 'published' || a.status === 'confirmed')
      .sort((a, b) => b.currentParticipants - a.currentParticipants)
      .slice(0, 5)
  }, [activities])

  return (
    <Layout>
      <div>
        {/* 搜索栏 */}
        <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索你感兴趣的活动..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        </div>

        {/* 标签筛选（水平滚动） */}
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 热门推荐（水平滚动） */}
        <div className="pb-2">
          <div className="px-4 mb-2">
            <h2 className="text-base font-bold text-gray-800">热门推荐</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-3 px-4 pb-2 min-w-max">
              {hotActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => (window.location.href = `/activity/${activity.id}`)}
                  className="w-[260px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                  {/* 封面 */}
                  <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
                    <img
                      src={activity.cover}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          activity.fee.type === 'free'
                            ? 'bg-green-500/90 text-white'
                            : 'bg-white/90 text-gray-700'
                        }`}
                      >
                        {activity.fee.type === 'free'
                          ? '免费'
                          : `¥${activity.fee.totalAmount}`}
                      </span>
                    </div>
                    {activity.currentParticipants >=
                      activity.accessRules.maxParticipants && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/90 text-white backdrop-blur-sm">
                          已满
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 内容 */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1 mb-1">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{activity.location}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        👥 {activity.currentParticipants}/
                        {activity.accessRules.maxParticipants}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 活动列表 */}
        <div className="px-4 pt-2">
          <h2 className="text-base font-bold text-gray-800 mb-3">全部活动</h2>
          {filteredActivities.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-sm text-gray-400">暂无符合条件的活动</p>
              <p className="text-xs text-gray-300 mt-1">试试其他关键词或标签吧</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>

        {/* 底部安全距离 */}
        <div className="h-4" />
      </div>
    </Layout>
  )
}
export default Home
