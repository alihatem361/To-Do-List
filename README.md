# To-Do-List

A cross-platform (iOS / Android / Web) to-do list app built with **React Native + Expo**,
**Redux Toolkit** for state management, and **axios** for networking. It ships with a small
**Express** backend that stores users and tasks and issues JWTs.

## Features

- **Authentication** — sign up and log in against the backend (JWT-based). The sign-up and
  login screens follow the provided card-on-blue design, including a "Show Password" toggle.
- **Task management** — create, edit, delete, and mark tasks complete.
- **Real-time-ish state** — Redux keeps the UI in sync with the server; pull-to-refresh
  re-fetches the latest tasks, and every mutation updates the store immediately.
- **Per-user data** — every task is scoped to the authenticated user on the server.

## Project structure

```
.
├── App.js                     # Root: Redux Provider + SafeArea + navigator
├── index.js                   # Expo entry point
├── src/
│   ├── components/            # CustomInput, CustomButton, Checkbox, TaskItem, EmptyState
│   ├── constants/             # colors (design palette), config (API base URL)
│   ├── navigation/            # AppNavigator (auth stack vs tasks stack)
│   ├── redux/                 # store + auth & tasks slices (Redux Toolkit)
│   ├── screens/               # SignUp, Login, Tasks, AddTask, EditTask
│   ├── services/              # axios instance + auth/task API wrappers
│   └── utils/                 # validation + cross-platform dialogs
└── server/                    # Express REST API (users + tasks, JWT auth)
```

## Getting started

### 1. Backend

```bash
cd server
npm install
npm start          # http://localhost:3000
```

### 2. App

```bash
npm install
npm start          # then press w (web), a (Android), or i (iOS)
```

The API base URL is resolved in `src/constants/config.js`. Android emulators reach the host
machine through `10.0.2.2`; web/iOS use `localhost`. For a physical device, replace it with
your machine's LAN IP.

## API

| Method | Route                     | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/api/auth/signup`        | Create an account, returns JWT  |
| POST   | `/api/auth/login`         | Log in, returns JWT             |
| GET    | `/api/tasks`              | List the user's tasks           |
| POST   | `/api/tasks`              | Create a task                   |
| PUT    | `/api/tasks/:id`          | Update a task                   |
| PATCH  | `/api/tasks/:id/toggle`   | Toggle completed state          |
| DELETE | `/api/tasks/:id`          | Delete a task                   |

All `/api/tasks` routes require an `Authorization: Bearer <token>` header.
