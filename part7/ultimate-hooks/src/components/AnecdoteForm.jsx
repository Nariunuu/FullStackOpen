import { useField, useAnecdotes } from '../hooks'

const AnecdoteForm = () => {
  const content = useField('text')
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = async (event) => {
    event.preventDefault()
    await addAnecdote({ content: content.value, votes: 0 })
    content.reset()
  }

  const { reset, ...inputProps } = content

  return (
    <form onSubmit={handleSubmit}>
      <input {...inputProps} />
      <button type='submit'>create</button>
    </form>
  )
}

export default AnecdoteForm
