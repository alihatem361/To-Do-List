# To-Do List

A mobile and web to-do list application built with Expo, React Native, Redux Toolkit, and an Express API.

## Features

- Create an account and sign in with JWT authentication
- View all tasks belonging to the signed-in user
- Add, edit, complete, and delete tasks
- Pull to refresh the task list
- Run the client on Android, iOS, or the web
- Store development data locally in a JSON file

## Tech Stack

- Expo 57 and React Native 0.86
- React Navigation
- Redux Toolkit and React Redux
- Axios
- Express 5
- JSON Web Tokens and bcryptjs

## Requirements

- Node.js and npm
- Expo Go for testing on a physical device, or an Android/iOS simulator
- For Android Emulator development, use the default `10.0.2.2` host mapping

## Installation

Install dependencies for both the Expo client and the API:

```bash
npm install
npm --prefix server install
```

## Running the Project

Start the API in one terminal:

```bash
npm run server
```

The API runs at `http://localhost:3000`.

Start Expo in a second terminal:

```bash
npm start
```

Then choose a target from the Expo CLI, or use one of these commands:

```bash
npm run android
npm run ios
npm run web
```

The client uses `http://localhost:3000` on iOS and web, and `http://10.0.2.2:3000` on the Android Emulator. For a physical device, update `BASE_URL` in `src/constants/config.js` to the computer's local network address, for example `http://192.168.1.10:3000`.

## Application Flow

1. Create an account from the sign-up screen, or sign in with an existing account.
2. Add a task with a title and optional description.
3. Toggle completion, edit task details, or delete a task from the task list.
4. Log out to return to the authentication screens.

## API

The Express API exposes public authentication routes and protected task routes. See [server/README.md](server/README.md) for the complete endpoint list, request bodies, and response examples.

All task requests require a JWT in the `Authorization: Bearer <token>` header.

## Data Storage

Development data is stored in `server/data.json`, which is created on the first write and ignored by Git. Delete that file to reset all accounts and tasks.

This local JSON store is intended for development and testing, not production use.

## Project Structure

```text
.
├── App.js                 # Expo application entry point
├── src/
│   ├── components/        # Reusable UI components
│   ├── navigation/        # Authentication and task navigation
│   ├── redux/             # Auth and task state management
│   ├── screens/           # Sign-up, login, and task screens
│   ├── services/          # API and token services
│   └── utils/              # Validation and dialog helpers
└── server/
    └── src/               # Express server, auth, database, and routes
```

## Development Notes

- The API defaults to port `3000`; set `PORT` to use another port.
- Set `JWT_SECRET` in the server environment to override the development default.
- There are currently no automated test scripts in the root or server package.
