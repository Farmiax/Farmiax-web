import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://farmiax-web-backend.onrender.com/api/v1';
const socketUrl = new URL(API_BASE_URL).origin;

export const socket = io(socketUrl, {
  autoConnect: false,
  withCredentials: true,
});
