import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { renderWithProviders } from '../test/renderWithProviders'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn(),
    setToken: vi.fn(),
    getAll: vi.fn().mockResolvedValue([]),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

test('submits the entered title, author, and url via the create mutation', async () => {
  blogService.create.mockResolvedValue({
    id: 'x',
    title: 'My Test Blog',
    author: 'Jane Doe',
    url: 'https://example.com',
  })
  const user = userEvent.setup()

  renderWithProviders(<BlogForm />, { user: { username: 'me' } })

  await user.type(screen.getByLabelText('title'), 'My Test Blog')
  await user.type(screen.getByLabelText('author'), 'Jane Doe')
  await user.type(screen.getByLabelText('url'), 'https://example.com')
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(blogService.create).toHaveBeenCalledTimes(1)
  expect(blogService.create.mock.calls[0][0]).toEqual({
    title: 'My Test Blog',
    author: 'Jane Doe',
    url: 'https://example.com',
  })
})
