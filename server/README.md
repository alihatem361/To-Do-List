# To-Do-List API

Express + JWT backend for the Expo app in the parent folder. Data is stored in
`data.json` (created on first write, gitignored) — no database to set up.

## Run

```bash
cd server
npm install
npm start
```

Listens on `http://localhost:3000`, which is what `src/constants/config.js`
points at. `npm run dev` restarts on file changes.

Set `PORT` or `JWT_SECRET` in the environment to override the defaults.

## Endpoints

Auth routes are public. Everything under `/api/tasks` requires
`Authorization: Bearer <token>` and only ever returns the calling user's tasks.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | `fullName`, `email`, `password` | `{ token, user }` |
| POST | `/api/auth/login` | `email`, `password` | `{ token, user }` |
| GET | `/api/tasks` | — | array of tasks |
| GET | `/api/tasks/:id` | — | task |
| POST | `/api/tasks` | `title`, `description` | created task |
| PUT | `/api/tasks/:id` | `title`, `description`, `completed` | updated task |
| PATCH | `/api/tasks/:id/toggle` | — | updated task |
| DELETE | `/api/tasks/:id` | — | `{ id, message }` |

A task looks like:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Buy milk",
  "description": "From the corner shop",
  "completed": false,
  "createdAt": "2026-08-17T20:32:27.365Z",
  "updatedAt": "2026-08-17T20:32:27.365Z"
}
```

Errors always come back as `{ "message": "..." }`, which is the shape the app's
axios interceptor reads.

## Notes

- Passwords are hashed with bcrypt; the hash is never returned.
- Emails are lowercased, so `Ali@Example.com` and `ali@example.com` are one account.
- Tokens expire after 7 days.
- CORS is wide open so the Expo web build can reach it from any dev port.
- To reset all accounts and tasks, delete `server/data.json`.
