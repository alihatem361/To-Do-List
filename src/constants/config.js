import { Platform } from 'react-native';

// The backend runs on localhost during development. Android emulators cannot
// reach the host machine via "localhost" — they proxy it through 10.0.2.2.
const getBaseUrl = () => {
  const PORT = 3000;

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PORT}`;
  }

  return `http://localhost:${PORT}`;
};

export const BASE_URL = getBaseUrl();
