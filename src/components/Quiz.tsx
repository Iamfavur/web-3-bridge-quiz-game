import { useEffect, useMemo, useState } from 'react'
import QuestionCard from './QuestionCard'
import Leaderboard from './Leaderboard'
import questionsData from '../data/questions.json'

type Question = {
  id: string
  question: string
  options: string[]
  answer: number // index of correct option
  time?: number // optional per-question time in seconds
}

const DEFAULT_TIME = 15 // seconds per question
const FEEDBACK_MS = 1200

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIME)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null)

  // Load questions (dynamic JSON import)
  useEffect(() => {
    try {
      // validate shape minimally
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        throw new Error('No questions found in data.')
      }
      const sanitized: Question[] = questionsData.map((q, i) => ({
        id: q.id ?? String(i),
        question: String(q.question ?? ''),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        answer: Number.isFinite(q.answer) ? q.answer : 0,
        time: typeof q.time === 'number' && q.time > 0 ? q.time : DEFAULT_TIME,
      }))
      setQuestions(sanitized)
      setLoadingError(null)
    } catch (err: any) {
      setLoadingError(err?.message ?? 'Failed to load questions.')
    }
  }, [])

  // Reset timer on question change
  useEffect(() => {
    if (!questions.length || isFinished) return
    const t = questions[current]?.time ?? DEFAULT_TIME
    setSecondsLeft(t)
  }, [current, questions, isFinished])

  // Countdown
  useEffect(() => {
    if (isFinished || !questions.length) return
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // time up — treat as incorrect, move on after feedback
          handleAnswerTimeout()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions, isFinished])

  function handleAnswerTimeout() {
    // prevent double-handling if already finished or no questions
    if (isFinished || !questions.length) return
    setLastWasCorrect(false)
    // show brief feedback then next
    setTimeout(() => {
      advance(false)
    }, FEEDBACK_MS)
  }

  function handleSelect(optionIndex: number) {
    if (!questions.length || isFinished) return
    const q = questions[current]
    const correct = optionIndex === q.answer
    setLastWasCorrect(correct)
    if (correct) setScore((s) => s + 1)
    // brief feedback then move to next
    setTimeout(() => {
      advance(true)
    }, FEEDBACK_MS)
  }

  function advance(didAnswer: boolean) {
    setLastWasCorrect(null)
    const next = current + 1
    if (next >= questions.length) {
      finishGame()
    } else {
      setCurrent(next)
      // secondsLeft will be reset by effect
    }
  }

  function finishGame() {
    setIsFinished(true)
    // ask for name and save to leaderboard
    try {
      const name = prompt('Game over! Enter your name for the leaderboard:', 'Anonymous') || 'Anonymous'
      const entry = {
        name,
        score,
        total: questions.length,
        date: new Date().toISOString(),
      }
      const raw = localStorage.getItem('quiz_leaderboard') || '[]'
      const list = JSON.parse(raw)
      if (!Array.isArray(list)) throw new Error('Invalid leaderboard data')
      list.push(entry)
      // sort descending and keep top 10
      list.sort((a: any, b: any) => b.score - a.score || +new Date(b.date) - +new Date(a.date))
      localStorage.setItem('quiz_leaderboard', JSON.stringify(list.slice(0, 10)))
    } catch (err) {
      // ignore storage errors — non-fatal
      console.error('Failed to save leaderboard', err)
    }
  }

  function restart() {
    setCurrent(0)
    setScore(0)
    setIsFinished(false)
    setLastWasCorrect(null)
    setSecondsLeft(questions[0]?.time ?? DEFAULT_TIME)
  }

  const progress = useMemo(() => {
    if (!questions.length) return '0 / 0'
    return `${current + (isFinished ? 0 : 1)} / ${questions.length}`
  }, [current, questions, isFinished])

  if (loadingError) {
    return (
      <div className="card error">
        <h2>Error</h2>
        <p>{loadingError}</p>
      </div>
    )
  }

  return (
    <div className="quiz-shell card">
      <div className="quiz-top">
        <div>
          <strong>Score:</strong> {score}
        </div>
        <div>
          <strong>Question:</strong> {progress}
        </div>
        <div>
          <strong>Time:</strong> {secondsLeft}s
        </div>
      </div>

      {!questions.length ? (
        <div className="loader">Loading questions...</div>
      ) : isFinished ? (
        <div className="result">
          <h2>Finished</h2>
          <p>
            Your score: {score} / {questions.length}
          </p>
          <div className="result-actions">
            <button onClick={restart}>Play Again</button>
            <button onClick={() => setShowLeaderboard((v) => !v)}>
              {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
            </button>
          </div>
          {showLeaderboard && <Leaderboard />}
        </div>
      ) : (
        <QuestionCard
          question={questions[current]}
          onSelect={handleSelect}
          feedback={lastWasCorrect}
          disabled={lastWasCorrect !== null}
        />
      )}
    </div>
  )
}
