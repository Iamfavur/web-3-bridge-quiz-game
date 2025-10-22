import { useEffect, useState } from 'react'

type Entry = {
  name: string
  score: number
  total: number
  date: string
}

export default function Leaderboard() {
  const [list, setList] = useState<Entry[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quiz_leaderboard') || '[]'
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setList(parsed)
    } catch {
      setList([])
    }
  }, [])

  function clearAll() {
    if (!confirm('Clear leaderboard?')) return
    try {
      localStorage.removeItem('quiz_leaderboard')
      setList([])
    } catch {
      // ignore
    }
  }

  return (
    <div className="leaderboard card">
      <h3>Leaderboard</h3>
      {list.length === 0 ? (
        <p>No scores yet. Play to add your score!</p>
      ) : (
        <ol className="leader-list">
          {list.map((e, i) => (
            <li key={i}>
              <strong>{e.name}</strong> — {e.score}/{e.total} <em>({new Date(e.date).toLocaleString()})</em>
            </li>
          ))}
        </ol>
      )}
      <div className="leader-actions">
        <button onClick={clearAll}>Clear</button>
      </div>
    </div>
  )
}
