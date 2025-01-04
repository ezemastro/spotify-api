import { BACKEND_URL } from '../config'

export const backendFetch = async (route, { body, method = 'GET' } = {}) => {
  const response = await fetch(BACKEND_URL + route, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body
  })

  const data = await response.json()
  if (data?.redirect) document.location.href = data.redirect
  return Object.assign(response, { data })
}
