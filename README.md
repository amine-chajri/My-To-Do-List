# My To-Do List

A full-stack to-do list application with **authentication**, **role-based access** (`admin` / `user`), and **full CRUD** for todos and users.

- **Client**: React 19 + Vite + React Router (black / dark blue theme)
- **Server**: Node.js + Express 5 + MongoDB (local) + JWT auth
- **Database**: local MongoDB at `mongodb://127.0.0.1:27017/my-todo-list`

## What the app does

- Visitors land on a **hero page** that explains the app.
- A user can **register** and **login**; after login they are taken to their own to-do list.
- Users can **create, read, update (edit / mark done), and delete** their own todos (full CRUD).
- An **admin** can open the admin panel and **manage all users**: change roles or delete users.
- There are only **two roles**: `user` and `admin`.

```text
to do list/
├── client/              # React front-end (Vite)
│   ├── .env             # VITE_API_URL=http://localhost:5000/api
│   ├── index.html
│   └── src/
│       ├── api.js               # fetch wrapper (adds JWT token & base URL)
│       ├── App.jsx              # route definitions
│       ├── main.jsx             # BrowserRouter + AuthProvider
│       ├── index.css            # black/yellow theme
│       ├── context/
│       │   ├── authContext.js   # the auth context + useAuth hook
│       │   └── AuthProvider.jsx # login / register / logout / restore session
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── ProtectedRoute.jsx  # requires login
│       │   └── AdminRoute.jsx      # requires admin role
│       └── pages/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Todos.jsx           # todo CRUD screen
│           └── Admin.jsx           # user management screen
│
└── server/              # Express back-end
    ├── .env             # PORT, MongoDB, JWT, CORS origin, default admin
    ├── server.js        # app entry + CORS + seed default admin
    ├── models/
    │   ├── User.js      # name, email, password, role (default "user")
    │   └── Todo.js      # title, description, completed, user ref
    ├── controllers/
    │   ├── authController.js   # register / login / me
    │   ├── todoController.js   # get/create/update/delete todos
    │   └── userController.js   # admin: list users, change role, delete user
    ├── middleware/
    │   └── auth.js      # protect (JWT) + adminOnly (role check)
    └── routes/
        ├── authRoutes.js
        ├── todoRoutes.js
        └── adminRoutes.js
```

## Step-by-step setup

### 1. Install MongoDB (local)

Make sure MongoDB is installed and running locally (default port `27017`). No cloud service is needed — the app connects to the local database automatically.

### 2. Configure the server

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/my-todo-list
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

# Allowed origin for the client (CORS) — must match the client URL below
CLIENT_ORIGIN=http://localhost:5173

# Default admin account, created automatically on first start
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@mytodolist.app
ADMIN_PASSWORD=admin123
```

> The CORS origin is read from `CLIENT_ORIGIN` in `server.js` (`server.js:17`). This links the client to the server.

### 3. Configure the client

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

This is the base URL used by `client/src/api.js`. It points to the Express API.

### 4. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 5. Run the server

```bash
cd server
npm run dev        # node --watch server.js
```

On first start it connects to MongoDB, seeds the default admin from `.env`, and prints:

```text
Connected to MongoDB
Default admin created: admin@mytodolist.app
My To-Do List server running on http://localhost:5000
```

### 6. Run the client

```bash
cd client
npm run dev        # Vite -> http://localhost:5173
```

Open `http://localhost:5173`.

## How to use

| Who       | What they can do                                             |
| --------- | ------------------------------------------------------------ |
| Visitor   | See the hero page, register, or log in                       |
| `user`    | Create / view / edit / complete / delete their own todos     |
| `admin`   | Everything a user can do, plus manage all users in Admin panel |

Test account (auto-created): `admin@mytodolist.app` / `admin123`. Create your own account to test the `user` role.

## API reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint        | Body                             | Access  |
| ------ | --------------- | -------------------------------- | ------- |
| POST   | `/auth/register` | `{ name, email, password }`      | Public  |
| POST   | `/auth/login`    | `{ email, password }`            | Public  |
| GET    | `/auth/me`       | `Authorization: Bearer <token>`  | Logged in |

### Todos (full CRUD)

All todo routes require `Authorization: Bearer <token>` and only touch the logged-in user's todos.

| Method | Endpoint     | Body                            | Description        |
| ------ | ------------ | ------------------------------- | ------------------ |
| GET    | `/todos`     | —                               | List my todos      |
| POST   | `/todos`     | `{ title, description? }`       | Create a todo      |
| PUT    | `/todos/:id` | `{ title?, description?, completed? }` | Edit / mark done |
| DELETE | `/todos/:id` | —                               | Delete a todo      |

### Admin (users)

All admin routes require the logged-in user to have role `admin`.

| Method | Endpoint                  | Body                 | Description              |
| ------ | ------------------------- | -------------------- | ------------------------ |
| GET    | `/admin/users`            | —                    | List all users (+ counts)|
| PATCH  | `/admin/users/:id/role`   | `{ role }` (`user`/`admin`) | Change a user's role |
| DELETE | `/admin/users/:id`        | —                    | Delete a user + their todos |

## How authentication works (flow)

1. User submits credentials on the Login/Register page.
2. `client/src/api.js` POSTs to `/api/auth/login` (or `/api/auth/register`).
3. The server verifies the password with `bcryptjs` and returns a signed **JWT** + the user object.
4. `AuthProvider` stores the JWT in `localStorage` and keeps the user in React state.
5. Every protected API call attaches `Authorization: Bearer <token>`.
6. On page refresh, `AuthProvider` reads the token and calls `/api/auth/me` to restore the session.
7. Routes are guarded by `ProtectedRoute` (any logged-in user) and `AdminRoute` (admins only).

## Development commands

```bash
cd server && npm run dev      # start API on :5000
cd client && npm run dev      # start Vite on :5173
cd client && npm run lint     # oxlint
cd client && npm run build    # production build
```