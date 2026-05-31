import { useAnecdotesQuery, useVoteAnecdote } from '../hooks/useAnecdoteQueries'
import { useNotify } from '../NotificationContext'
import { useFilter } from '../store'

const AnecdoteList = () => {
  const { data: anecdotes = [] } = useAnecdotesQuery()
  const filter = useFilter()
  const voteAnecdote = useVoteAnecdote()
  const notify = useNotify()

  const handleVote = (anecdote) => {
    voteAnecdote.mutate(anecdote, {
      onSuccess: () => notify(`you voted '${anecdote.content}'`),
    })
  }

  const visibleAnecdotes = [...anecdotes]
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {visibleAnecdotes.map(anecdote => (
        <div key={anecdote.id} data-testid="anecdote">
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
