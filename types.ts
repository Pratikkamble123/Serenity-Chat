
export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  lastSeen?: Date;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: MessageStatus;
  reactions: Reaction[];
  type: 'text' | 'image' | 'voice' | 'file';
  mediaUrl?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  replyToId?: string;
}

export interface Chat {
  id: string;
  type: 'individual' | 'group';
  name?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  isMuted?: boolean;
}

export interface AppState {
  currentUser: User;
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  typingUsers: Record<string, string[]>; // chatId -> userIds
}
