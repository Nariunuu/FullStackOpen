import { useAnecdotesQuery, useCreateAnecdote } from './hooks/useAnecdoteQueries'
import { useNotify } from './NotificationContext'
import Notification from './components/Notification'
import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const { isPending, isError } = useAnecdotesQuery()
  const createAnecdote = useCreateAnecdote()
  const notify = useNotify()

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  if (isPending) {
    return <div>loading data...</div>
  }

  const handleCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      notify('too short anecdote, must have length 5 or more')
      return
    }
    event.target.anecdote.value = ''
    createAnecdote.mutate(content, {
      onSuccess: () => notify(`you created '${content}'`),
      onError: (error) => {
        const reason = error.response?.data?.error || error.message
        notify(`failed to create anecdote: ${reason}`)
      },
    })
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <input name="anecdote" placeholder="new anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default App
