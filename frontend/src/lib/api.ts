import axios from 'axios';
import { io, Socket } from 'socket.io-client';

export const API_BASE = 'http://localhost:4000/api/v1';
export const SOCKET_URL = 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socketInstance;
}
