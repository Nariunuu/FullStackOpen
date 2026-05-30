import StatisticLine from "./StatisticLine"

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = Math.round((good - bad) / total * 100) / 100
  const positive = Math.round((good / total) * 100) / 100
  return (
    total > 0 ? (
    <div>
      <h1>Statistics</h1>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="Total" value={total} />
      <StatisticLine text="Average" value={average} />
      <StatisticLine text="Positive" value={positive} />
    </div>
  ) : (
    <div>
      <h1>Statistics</h1>
      <p>No feedback given</p>
    </div>
  )
  )
}

export default Statistics