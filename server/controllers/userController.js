const User = require('../models/User');
const Todo = require('../models/Todo');

// GET /api/admin/users  (list all users, admins only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const counts = await Todo.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
    ]);

    const todoCountMap = {};
    counts.forEach((c) => {
      todoCountMap[c._id] = c.count;
    });

    const result = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      todosCount: todoCountMap[u._id] || 0,
    }));

    return res.status(200).json({ users: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/users/:id/role  (change role, admins only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "user" or "admin"' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user.id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot demote your own account' });
    }

    user.role = role;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Role updated', user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id  (delete a user + their todos, admins only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await Todo.deleteMany({ user: user._id });
    await user.deleteOne();

    return res.status(200).json({ message: 'User and their todos deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};