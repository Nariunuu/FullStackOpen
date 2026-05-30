import { render, screen } from '@testing-library/react'
import BlogDetail from './BlogDetail'

const blog = {
  id: 'b1',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  user: { username: 'creator', name: 'Creator' },
}

const renderDetail = (overrides = {}) =>
  render(
    <BlogDetail
      blog={blog}
      currentUser={null}
      onLike={() => {}}
      onDelete={() => {}}
      {...overrides}
    />
  )

test('unauthenticated user sees blog info and likes but no buttons', () => {
  renderDetail()

  expect(screen.getByText(/React patterns/)).toBeInTheDocument()
  expect(screen.getByText(/Michael Chan/)).toBeInTheDocument()
  expect(screen.getByText(/likes 7/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('non-creator authenticated user sees only the like button', () => {
  renderDetail({ currentUser: { username: 'other', name: 'Other' } })

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('the creator sees both like and remove buttons', () => {
  renderDetail({ currentUser: { username: 'creator', name: 'Creator' } })

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
})
