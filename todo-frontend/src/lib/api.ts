import axios from 'axios';

const isServer = typeof window === 'undefined';

const api = axios.create({
  // HYBRID CONFIGURATION:
  // - On the server side (SSR prefetching), query directly via Docker internal networking (API_URL_SERVER).
  // - On the client side (browser runtime), route requests to the local origin (/api/v1) for rewrite proxying.
  baseURL: isServer
    ? (process.env.API_URL_SERVER || 'http://localhost:3000/api/v1')
    : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
