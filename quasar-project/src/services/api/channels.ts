import { api } from './http';

export type Channel = {
  id: number;
  name: string;
  description?: string | null;
  is_private: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: number;
  channel_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: { id: number; username: string; email: string };
};

export function listChannels() {
  return api.request<Channel[]>('GET', '/channels');
}

export function getChannel(id: number) {
  return api.request<Channel>('GET', `/channels/${id}`);
}

export function createChannel(payload: { name: string; description?: string; is_private?: boolean }) {
  return api.request<Channel>('POST', '/channels', payload);
}

export function joinChannel(id: number) {
  return api.request<{ ok: true }>('POST', `/channels/${id}/join`);
}

export function joinChannelByName(name: string) {
  return api.request<{ ok: true; channel: Channel }>('POST', `/channels/join-by-name`, { name });
}

export function listMessages(channelId: number) {
  return api.request<Message[]>('GET', `/channels/${channelId}/messages`);
}

export function postMessage(channelId: number, content: string) {
  return api.request<Message>('POST', `/channels/${channelId}/messages`, { content });
}


