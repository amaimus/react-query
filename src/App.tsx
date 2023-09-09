/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'
import { useQuery } from '@tanstack/react-query'

const API_URL = 'https://randomuser.me/api?'

const fetchUsers = async ({ page }: { page: number }) => {
  return await fetch(`${API_URL}seed=amaimus&results=10&page=${page}`)
    .then(async res => {
      if (!res.ok) throw new Error('Error retrieving data')
      return await res.json()
    })
    .then(res => res.results)
}

function App () {
  const { isLoading, isError, data: users = [] } = useQuery<User[]>(
    ['users'],
    async () => await fetchUsers({ page: 1 })
  )
  const [showRowColors, setShowRowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)

  /* const originalUsers = useRef<User[]>([]) */

  const toggleColors = () => {
    setShowRowColors(!showRowColors)
  }

  const handleDeleteUser = (loginId: string) => {
    /* const filteredUsers = users.filter(user => user.login.uuid !== loginId)
    setUsers(filteredUsers) */
  }

  const resetInitialState = () => {
    /* setUsers(originalUsers.current) */
  }

  const filteredUsers = useMemo(() => {
    return filterCountry
      ? users.filter(user => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NAME) {
      return filteredUsers.toSorted((a, b) => a.name.first.localeCompare(b.name.first))
    }
    if (sorting === SortBy.LAST) {
      return filteredUsers.toSorted((a, b) => a.name.last.localeCompare(b.name.last))
    }
    if (sorting === SortBy.COUNTRY) {
      return filteredUsers.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
    }
    return filteredUsers
  }, [filteredUsers, sorting])

  const handleChangeSorting = (sort: SortBy) => {
    const newSortingValue = sorting === SortBy.NONE ? sort : SortBy.NONE
    setSorting(newSortingValue)
  }

  return (
    <>
      <h1>React Typescript Proficiency Test</h1>
      <header style={{ marginBottom: '36px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button onClick={toggleColors}>
          Show Row Colors
        </button>
        <button onClick={() => { handleChangeSorting(SortBy.COUNTRY) }}>
          Sort by Country
        </button>
        <button onClick={resetInitialState}>
          Reset
        </button>
        <input type='text' onChange={(e) => { setFilterCountry(e.target.value) }} placeholder='Filter by...'/>
      </header>
      <main>
        { sortedUsers.length > 0 && (
          <UsersList
            changeSorting={handleChangeSorting}
            deleteUser={handleDeleteUser}
            users={sortedUsers}
            showRowColors={showRowColors}
          />
        )}

        { isLoading && <p>Loading</p>}

        { !isLoading && isError && <p> {isError} </p>}

        { !isLoading && !isError && sortedUsers.length === 0 && <p>No hay usuarios</p>}

        { !isLoading && !isError && sortedUsers.length > 0 &&
          <button onClick={() => { setCurrentPage(currentPage + 1) }}>Load more</button>
        }

      </main>
    </>
  )
}

export default App
