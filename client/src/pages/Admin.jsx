import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext.js'
import { api } from '../api.js'

export default function Admin() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await api('/admin/users', { token })
        if (!active) return
        setUsers(data.users)
        setError('')
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [token])

  async function refreshUsers() {
    const data = await api('/admin/users', { token })
    setUsers(data.users)
  }

  async function changeRole(user, role) {
    if (role === user.role) return
    setError('')
    try {
      await api(`/admin/users/${user.id}/role`, { method: 'PATCH', body: { role }, token })
      await refreshUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeUser(user) {
    if (!window.confirm(`Delete ${user.name} and all of their todos?`)) return
    setError('')
    try {
      await api(`/admin/users/${user.id}`, { method: 'DELETE', token })
      await refreshUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="admin-page">
      <div className="container">
        <div className="todos-header">
          <div>
            <h1>Admin panel</h1>
            <p>Manage all users and their roles.</p>
          </div>
          <div className="todos-stat">{users.length} users</div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-block">
            <span className="spinner" />
            Loading users…
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>No users found</h3>
            <p>No accounts have been created yet.</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Todos</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.todosCount}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        {user.role === 'user' ? (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => changeRole(user, 'admin')}
                          >
                            Make admin
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => changeRole(user, 'user')}
                          >
                            Make user
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeUser(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}