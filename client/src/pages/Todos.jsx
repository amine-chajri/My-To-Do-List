import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext.js'
import { api } from '../api.js'

const emptyForm = { title: '', description: '' }

export default function Todos() {
  const { token } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await api('/todos', { token })
        if (!active) return
        setTodos(data.todos)
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

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    setError('')
    try {
      const data = await api('/todos', { method: 'POST', body: form, token })
      setTodos([data.todo, ...todos])
      setForm(emptyForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(todo) {
    try {
      const data = await api(`/todos/${todo._id}`, {
        method: 'PUT',
        body: { completed: !todo.completed },
        token,
      })
      setTodos(todos.map((t) => (t._id === todo._id ? data.todo : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id)
    setEditForm({ title: todo.title, description: todo.description })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  async function handleSaveEdit(e) {
    e.preventDefault()
    if (!editForm.title.trim()) return
    setSaving(true)
    setError('')
    try {
      const data = await api(`/todos/${editingId}`, {
        method: 'PUT',
        body: editForm,
        token,
      })
      setTodos(todos.map((t) => (t._id === editingId ? data.todo : t)))
      cancelEdit()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try {
      await api(`/todos/${id}`, { method: 'DELETE', token })
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const doneCount = todos.filter((t) => t.completed).length

  return (
    <section className="todos-page">
      <div className="container">
        <div className="todos-header">
          <div>
            <h1>My To-Dos</h1>
            <p>Create, edit and complete your tasks.</p>
          </div>
          <div className="todos-stat">
            {doneCount}/{todos.length} done
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleCreate} className="todo-form">
          <input
            className="input"
            type="text"
            placeholder="Task title…"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="btn btn-yellow" disabled={saving}>
            {saving ? 'Saving…' : 'Add task'}
          </button>
        </form>

        {loading && (
          <div className="loading-block">
            <span className="spinner" />
            Loading your tasks…
          </div>
        )}

        {!loading && todos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>No tasks yet</h3>
            <p>Add your first task above and start organizing your day.</p>
          </div>
        )}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className={`todo-item${todo.completed ? ' done' : ''}`}>
              {editingId === todo._id ? (
                <form onSubmit={handleSaveEdit} className="todo-edit">
                  <input
                    className="input"
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                  <input
                    className="input"
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <div className="todo-actions">
                    <button type="submit" className="btn btn-yellow btn-sm" disabled={saving}>
                      Save
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <button
                    type="button"
                    className="todo-check"
                    onClick={() => handleToggle(todo)}
                    aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
                  >
                    {todo.completed ? '✓' : ''}
                  </button>
                  <div className="todo-body">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                    <span className="todo-date">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="todo-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => startEdit(todo)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(todo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}