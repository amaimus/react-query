import { useInfiniteQuery } from '@tanstack/react-query'
import { type User } from '../types.d'
import { fetchUsers } from '../services/users'

export function useUsers () {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery<{ nextPage: number, users: User[] }>(
    ['users'],
    fetchUsers,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false
    }
  )
  const users = data?.pages?.flatMap(page => page.users) ?? []

  return {
    isLoading,
    isError,
    users,
    refetch,
    fetchNextPage,
    hasNextPage
  }
}
