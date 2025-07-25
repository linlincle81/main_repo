'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts'

// ✅ 막대그래프: 월별 학습 시간(시간 단위)
const barData = [
  { month: '3월', hours: 12 },
  { month: '4월', hours: 18 },
  { month: '5월', hours: 26 },
  { month: '6월', hours: 30 },
  { month: '7월', hours: 42 },
]

// ✅ 원형그래프: 퀴즈 정답률 분포
const pieData = [
  { name: '정답', value: 70 },
  { name: '오답', value: 20 },
  { name: '부분정답', value: 10 },
]
const COLORS = ['#00C49F', '#FF8042', '#FFBB28']

// ✅ 선형그래프: 주차별 학습 진도율(%)
const lineData = [
  { week: '1주차', progress: 10 },
  { week: '2주차', progress: 25 },
  { week: '3주차', progress: 45 },
  { week: '4주차', progress: 60 },
  { week: '5주차', progress: 80 },
  { week: '6주차', progress: 95 },
]

export default function TopicDetailPage() {
  // ✅ Supabase에서 가져온 topic 목록
  const [topics, setTopics] = useState<any[]>([])

  // ✅ 마운트 시 목록 가져오기
  useEffect(() => {
    fetch('/api/papers')
      .then(res => res.json())
      .then(setTopics)
      .catch(err => console.error(err))
  }, [])

  // ✅ 삭제 기능
  const handleDelete = async (topic_id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return
    try {
      const res = await fetch(`/api/papers?id=${topic_id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setTopics(prev => prev.filter(t => t.topic_id !== topic_id))
      } else {
        alert('삭제 실패')
      }
    } catch (e) {
      console.error(e)
      alert('삭제 중 오류 발생')
    }
  }

  // ✅ 수정 기능
  const handleEdit = async (topic_id: number) => {
    const topic = topics.find(t => t.topic_id === topic_id)
    if (!topic) return
    const newName = prompt('새로운 주제명을 입력하세요', topic.topic_name)
    if (!newName || newName.trim() === '') return
    try {
      const res = await fetch('/api/papers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id,
          topic_name: newName,
          topic_description: topic.topic_description // 기존 설명 유지
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTopics(prev =>
          prev.map(t =>
            t.topic_id === topic_id ? { ...t, topic_name: newName } : t
          )
        )
      } else {
        alert('수정 실패')
      }
    } catch (e) {
      console.error(e)
      alert('수정 중 오류 발생')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="text-2xl font-bold">로고 DeepMinder</div>
        {/* 추가하기 버튼은 나중에 구현 가능 */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">
          논문 추가하기
        </button>
      </header>

      {/* 검색창 */}
      <div className="px-4 py-3 text-lg font-semibold">검색창</div>

      {/* ✅ 그래프 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100">
        {/* 막대그래프 */}
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <h2 className="font-bold mb-2">월별 학습 시간</h2>
          <BarChart width={300} height={200} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </div>

        {/* 원형그래프 */}
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <h2 className="font-bold mb-2">퀴즈 정답률</h2>
          <PieChart width={300} height={200}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* 선형그래프 */}
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <h2 className="font-bold mb-2">주차별 학습 진도율</h2>
          <LineChart width={300} height={200} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="progress" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      {/* ✅ topics 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4">
        {topics.map(topic => (
          <div key={topic.topic_id} className="bg-white rounded shadow p-4">
            <div className="font-bold mb-2">{topic.topic_name}</div>
            <div className="text-sm text-gray-600 mb-2">{topic.topic_description}</div>
            <div className="text-xs text-gray-400">
              생성일시 {new Date(topic.topic_created_at).toLocaleString()}
            </div>


            <div className="mt-3 flex gap-2">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(topic.topic_id)}
              >
                수정
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(topic.topic_id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
