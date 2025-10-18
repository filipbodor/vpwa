export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (saved) this.token = saved;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      if (token) localStorage.setItem('auth_token', token);
      else localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const hasBody = body !== undefined && body !== null;
    if (hasBody) headers['Content-Type'] = 'application/json';
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : null,
      credentials: 'include',
    });

    const text = await res.text();
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson && text ? JSON.parse(text) : (text as unknown as T);
    if (!res.ok) {
      const message = (data as any)?.error?.message || res.statusText || 'Request failed';
      throw new Error(message);
    }
    return data as T;
  }
}

export const api = new ApiClient('http://localhost:3333');


