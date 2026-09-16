const Todo = require('../models/Todo');

// GET /api/todos  (list the todos of the logged-in user)
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/todos  (create a todo for the logged-in user)
exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      user: req.user.id,
    });

    return res.status(201).json({ message: 'Todo created', todo });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/todos/:id  (update a todo owned by the logged-in user)
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    return res.status(200).json({ message: 'Todo updated', todo });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/todos/:id  (delete a todo owned by the logged-in user)
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};