import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: userService.getAll })
