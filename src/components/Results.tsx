import { useUsers } from '../hooks/useUsers'

export const Results = () => {
  const { users } = useUsers()

  return (
    <>
      {users.length}
    </>
  )
}
