
import { User, Chat, Message } from './types';

export const CURRENT_USER: User = {
  id: 'u-me',
  name: 'Pratik Kamble',
  avatar: 'https://picsum.photos/seed/me/100/100',
  status: 'online',
};

export const INITIAL_USERS: User[] = [
  { id: 'u-1', name: 'Soham Burhan', avatar: 'https://picsum.photos/seed/sarah/100/100', status: 'online' },
  { id: 'u-2', name: 'Design Team', avatar: 'https://picsum.photos/seed/group1/100/100', status: 'online' },
  { id: 'u-3', name: 'Gaurav Rakde', avatar: 'https://picsum.photos/seed/michael/100/100', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
  { id: 'u-4', name: 'Emily Davis', avatar: 'https://picsum.photos/seed/emily/100/100', status: 'away' },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'c-1',
    type: 'individual',
    participants: ['u-me', 'u-1'],
    unreadCount: 2,
    name: 'Soham Burhan',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    id: 'c-2',
    type: 'group',
    participants: ['u-me', 'u-1', 'u-4'],
    unreadCount: 0,
    name: 'Product Design',
    avatar: 'https://picsum.photos/seed/group1/100/100',
  },
  {
    id: 'c-3',
    type: 'individual',
    participants: ['u-me', 'u-3'],
    unreadCount: 0,
    name: 'Gaurav Rakde',
    avatar: 'https://picsum.photos/seed/michael/100/100',
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c-1': [
    {
      id: 'm-1',
      chatId: 'c-1',
      senderId: 'u-1',
      text: 'Hey! How’s the new design coming along?',
      timestamp: new Date(Date.now() - 7200000),
      status: 'read',
      reactions: [],
      type: 'text',
    },
    {
      id: 'm-2',
      chatId: 'c-1',
      senderId: 'u-me',
      text: 'Yeah, totally agree. Calm interfaces just feel better to use.',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      reactions: [{ emoji: '👍', userId: 'u-1' }],
      type: 'text',
    }
  ],
  'c-2': [
    {
      id: 'm-3',
      chatId: 'c-2',
      senderId: 'u-4',
      text: 'Did you see the latest feedback from the team?',
      timestamp: new Date(Date.now() - 86400000),
      status: 'read',
      reactions: [],
      type: 'text',
    }
  ],
  'c-3': []
};
