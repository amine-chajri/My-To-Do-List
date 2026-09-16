const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Make sure it is running.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}