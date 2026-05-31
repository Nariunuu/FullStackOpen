import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'

const ANECDOTES_KEY = ['anecdotes']

export const useAnecdotesQuery = () =>
  useQuery({
    queryKey: ANECDOTES_KEY,
    queryFn: anecdoteService.getAll,
    retry: 1,
  })

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (created) => {
      queryClient.setQueryData(ANECDOTES_KEY, (old = []) => [...old, created])
    },
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: anecdoteService.vote,
    onSuccess: (updated) => {
      queryClient.setQueryData(ANECDOTES_KEY, (old = []) =>
        old.map(a => a.id === updated.id ? updated : a)
      )
    },
  })
}
