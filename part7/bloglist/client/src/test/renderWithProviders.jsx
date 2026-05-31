import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationProvider } from '../contexts/NotificationContext'
import { UserContext } from '../contexts/UserContext'

const buildQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

export const renderWithProviders = (ui, { user = null } = {}) => {
  const queryClient = buildQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NotificationProvider>
          <UserContext.Provider
            value={{ user, login: () => {}, logout: () => {} }}
          >
            {ui}
          </UserContext.Provider>
        </NotificationProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}
