import axios from 'axios';

const API = axios.create({
  baseURL: 'https://6a8a28a620fcac8c1edf230d.mockapi.io/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;