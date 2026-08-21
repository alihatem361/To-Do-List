import { Platform } from 'react-native';

const getBaseUrl = () => {
  const PORT = 3000;

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PORT}`;
  }

  return `http://localhost:${PORT}`;
};

export const BASE_URL = getBaseUrl();
