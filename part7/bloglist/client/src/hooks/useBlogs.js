import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const QUERY_KEY = ['blogs']

export const useBlogs = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: blogService.getAll,
    enabled,
  })

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useLikeBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (blog) =>
      blogService.update(blog.id, { likes: blog.likes + 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
