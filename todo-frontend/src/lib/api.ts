import axios from 'axios';

const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: isServer
    ? (process.env.API_URL_SERVER || 'http://localhost:3000/api/v1')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
