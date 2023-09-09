/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'

const API_URL = 'https://randomuser.me/api?'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showRowColors, setShowRowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const toggleColors = () => {
    setShowRowColors(!showRowColors)
  }

  const handleDeleteUser = (loginId: string) => {
    const filteredUsers = users.filter(user => user.login.uuid !== loginId)
    setUsers(filteredUsers)
  }

  const resetInitialState = () => {
    setUsers(originalUsers.current)
  }

  useEffect(() => {
    setLoading(true)
    setError(false)

    fetch(`${API_URL}seed=amaimus&results=10&page=${currentPage}`)
      .then(async res => {
        if (!res.ok) throw new Error('Error retrieving data')
        return await res.json()
      })
      .then(res => {
        setUsers(prevUsers => prevUsers.concat(res.results))
        originalUsers.current = res.results
      })
      .catch(err => { setError(err.message) })
      .finally(() => { setLoading(false) })
  }, [currentPage])

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
      <header>
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
        { loading && <p>Loading</p>}
        { !loading && error && <p> {error} </p>}
        { !loading && !error && sortedUsers.length === 0 && <p>No hay usuarios</p>}
        { !loading && !error && sortedUsers.length > 0 &&
          <button onClick={() => { setCurrentPage(currentPage + 1) }}>Load more</button>
        }

      </main>
    </>
  )
}

export default App
