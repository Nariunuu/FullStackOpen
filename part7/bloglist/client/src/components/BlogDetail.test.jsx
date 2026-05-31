import { screen } from '@testing-library/react'
import BlogDetail from './BlogDetail'
import { renderWithProviders } from '../test/renderWithProviders'

const blog = {
  id: 'b1',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  comments: [],
  user: { id: 'u1', username: 'creator', name: 'Creator' },
}

test('unauthenticated user sees blog info and likes but no buttons', () => {
  renderWithProviders(<BlogDetail blog={blog} />, { user: null })

  expect(screen.getByText(/React patterns/)).toBeInTheDocument()
  expect(screen.getByText(/Michael Chan/)).toBeInTheDocument()
  expect(screen.getByText(/likes 7/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('non-creator authenticated user sees only the like button', () => {
  renderWithProviders(<BlogDetail blog={blog} />, {
    user: { username: 'other', name: 'Other' },
  })

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('the creator sees both like and remove buttons', () => {
  renderWithProviders(<BlogDetail blog={blog} />, {
    user: { username: 'creator', name: 'Creator' },
  })

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
})
