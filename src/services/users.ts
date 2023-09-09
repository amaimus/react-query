export const API_URL = 'https://randomuser.me/api?'

export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  return await fetch(`${API_URL}seed=amaimus&results=10&page=${pageParam}`)
    .then(async res => {
      if (!res.ok) throw new Error('Error retrieving data')
      return await res.json()
    })
    .then(res => {
      const maxPages = 5
      const nextPage = res.info.page + 1 > maxPages ? undefined : res.info.page + 1

      return {
        users: res.results,
        nextPage
      }
    })
}
