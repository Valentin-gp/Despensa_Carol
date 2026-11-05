import type { ChatRequest, ChatResponse, SiteData } from '../../shared/types';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? 'ERROR', data.message ?? 'Ocurrió un error. Probá de nuevo.', res.status);
  return data as T;
}

export const getSite = () => request<SiteData>('/api/public/site');
export const sendChat = (body: ChatRequest) => request<ChatResponse>('/api/chat', { method: 'POST', body: JSON.stringify(body) });

export const adminMe = () => request<{ authenticated: boolean }>('/api/admin/auth/me');
export const adminLogin = (key: string) => request<{ ok: true }>('/api/admin/auth/login', { method: 'POST', body: JSON.stringify({ key }) });
export const adminLogout = () => request<{ ok: true }>('/api/admin/auth/logout', { method: 'POST' });
