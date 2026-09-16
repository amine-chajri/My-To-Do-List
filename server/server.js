require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/User');

const app = express();

// CORS: allow the client origin defined in .env
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('My To-Do List API is up and running!');
});

// Create the default admin from .env on startup (if it does not exist yet)
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) return;

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin account already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, role: 'admin' });
  console.log(`Default admin created: ${email} (password: ${password})`);
}

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/my-todo-list');
    console.log('Connected to MongoDB');

    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`My To-Do List server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();