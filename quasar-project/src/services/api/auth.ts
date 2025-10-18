import { api } from './http';

type RegisterResponse = {
  user: { id: number; username: string; email: string };
  token: { type?: string; token: string; refreshToken?: string } | string;
};

type LoginResponse = { token: { type?: string; token: string; refreshToken?: string } } | { token: string };

export async function register(username: string, email: string, password: string) {
  const res = await api.request<RegisterResponse>('POST', '/auth/register', { username, email, password });
  const token = typeof res.token === 'string' ? res.token : res.token.token;
  api.setToken(token);
  return res.user;
}

export async function login(email: string, password: string) {
  const res = await api.request<LoginResponse>('POST', '/auth/login', { email, password });
  const token = (res as any).token?.token ?? (res as any).token;
  api.setToken(token);
  return token as string;
}

export async function me() {
  return api.request<{ user: { id: number; username: string; email: string } }>('GET', '/auth/me');
}

export function logout() {
  api.setToken(null);
  return Promise.resolve();
}


