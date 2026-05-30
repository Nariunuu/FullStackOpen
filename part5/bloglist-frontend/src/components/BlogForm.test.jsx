import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls onCreate with the entered title, author, and url on submit', async () => {
  const user = userEvent.setup()
  const onCreate = vi.fn().mockResolvedValue(true)

  render(<BlogForm onCreate={onCreate} />)

  await user.type(screen.getByPlaceholderText('title'), 'My Test Blog')
  await user.type(screen.getByPlaceholderText('author'), 'Jane Doe')
  await user.type(screen.getByPlaceholderText('url'), 'https://example.com')
  await user.click(screen.getByText('create'))

  expect(onCreate.mock.calls).toHaveLength(1)
  expect(onCreate.mock.calls[0][0]).toEqual({
    title: 'My Test Blog',
    author: 'Jane Doe',
    url: 'https://example.com',
  })
})
