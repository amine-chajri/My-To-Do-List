const express = require('express');
const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;