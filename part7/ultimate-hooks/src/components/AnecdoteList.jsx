import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <ul>
      {anecdotes.map((a) => (
        <li key={a.id}>
          {a.content}
          <button onClick={() => deleteAnecdote(a.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
}

export default AnecdoteList
