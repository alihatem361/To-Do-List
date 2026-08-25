// In-memory token store. Kept out of Redux so the axios interceptor can read it
// synchronously on every request without importing the store (avoids a cycle).
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

export const getAuthToken = () => authToken;
