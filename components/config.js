// components/config.js
export const API_BASE = location.hostname.endsWith('github.io')
  ? 'https://jlzoo.onrender.com/api'
  : 'http://localhost:3000/api';
