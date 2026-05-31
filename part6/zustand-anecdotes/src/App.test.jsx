import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, test, expect, beforeEach } from 'vitest'
import App from './App'
import anecdoteService from './services/anecdotes'
import { resetStores } from './store'
import { NotificationContextProvider } from './NotificationContext'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    vote: vi.fn(),
  },
}))

const sampleAnecdotes = [
  { id: '1', content: 'react is fun', votes: 1 },
  { id: '2', content: 'svelte is fast', votes: 5 },
  { id: '3', content: 'angular is verbose', votes: 3 },
]

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </NotificationContextProvider>
  )
}

beforeEach(() => {
  resetStores()
  vi.clearAllMocks()
  anecdoteService.getAll.mockResolvedValue(sampleAnecdotes)
  anecdoteService.vote.mockImplementation(async (a) => ({ ...a, votes: a.votes + 1 }))
})

test('6.12: state is initialized with anecdotes from the backend', async () => {
  renderApp()

  expect(await screen.findByText('react is fun')).toBeInTheDocument()
  expect(screen.getByText('svelte is fast')).toBeInTheDocument()
  expect(screen.getByText('angular is verbose')).toBeInTheDocument()
})

test('6.13: anecdotes are displayed sorted by votes descending', async () => {
  renderApp()
  await screen.findByText('react is fun')

  const anecdotes = screen.getAllByTestId('anecdote')
  expect(anecdotes).toHaveLength(3)
  expect(anecdotes[0]).toHaveTextContent('svelte is fast')
  expect(anecdotes[1]).toHaveTextContent('angular is verbose')
  expect(anecdotes[2]).toHaveTextContent('react is fun')
})

test('6.14: list is filtered by the filter input', async () => {
  const user = userEvent.setup()
  renderApp()
  await screen.findByText('react is fun')

  await user.type(screen.getByPlaceholderText('filter'), 'svelte')

  const anecdotes = screen.getAllByTestId('anecdote')
  expect(anecdotes).toHaveLength(1)
  expect(anecdotes[0]).toHaveTextContent('svelte is fast')
})

test('6.15: voting increases the vote count for the chosen anecdote', async () => {
  const user = userEvent.setup()
  renderApp()
  await screen.findByText('react is fun')

  const reactAnecdote = screen.getByText('react is fun').closest('[data-testid="anecdote"]')
  expect(reactAnecdote).toHaveTextContent('has 1')

  await user.click(within(reactAnecdote).getByRole('button', { name: 'vote' }))

  expect(await within(reactAnecdote).findByText(/has 2/)).toBeInTheDocument()
  expect(anecdoteService.vote.mock.calls[0][0]).toEqual(
    expect.objectContaining({ id: '1', votes: 1 })
  )
})
