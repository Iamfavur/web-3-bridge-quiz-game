type Props = {
  question: {
    id: string
    question: string
    options: string[]
    answer: number
    time?: number
  }
  onSelect: (index: number) => void
  feedback: boolean | null
  disabled?: boolean
  selectedIndex?: number | null
}

export default function QuestionCard({ question, onSelect, feedback, disabled, selectedIndex }: Props) {
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return (
      <div className="card error">
        <h3>Invalid question data</h3>
        <p>Skipping this question.</p>
      </div>
    )
  }

  return (
    <div className="question-card">
      <h3 className="question-text">{question.question}</h3>
      <div className="options">
        {question.options.map((opt, idx) => {
          const isCorrect = feedback !== null && idx === question.answer
          const isWrongSelected = feedback === false && selectedIndex === idx
          return (
            <button
              key={idx}
              className={[
                'option-btn',
                disabled ? 'disabled' : '',
                isCorrect ? 'correct' : '',
                isWrongSelected ? 'wrong' : '',
              ].join(' ')}
              onClick={() => !disabled && onSelect(idx)}
              disabled={disabled}
            >
              <span className="option-index">{String.fromCharCode(65 + idx)}.</span> {opt}
            </button>
          )
        })}
      </div>
      {feedback === true && <div className="feedback correct">Correct!</div>}
      {feedback === false && <div className="feedback wrong">Time's up or Incorrect</div>}
    </div>
  )
}
