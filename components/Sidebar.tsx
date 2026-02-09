
import React from 'react';
import { Chat, User, Message } from '../types';
import Avatar from './Avatar';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  chats, 
  activeChatId, 
  onSelectChat,
  searchQuery,
  onSearchChange
}) => {
  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar user={currentUser} size="md" showStatus />
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">{currentUser.name}</h1>
            <p className="text-[10px] text-green-600 font-medium">Online</p>
          </div>
        </div>
        <div className="flex gap-2 text-slate-400">
           <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
           </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto px-2">
        {filteredChats.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-center gap-3 p-3 mb-1 rounded-2xl transition-all duration-200 group ${
              activeChatId === chat.id 
                ? 'bg-[#EBF1FA] text-slate-900' 
                : 'hover:bg-slate-50'
            }`}
          >
            <Avatar user={{ avatar: chat.avatar || '', name: chat.name || '' } as User} size="lg" />
            <div className="flex-grow text-left min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-semibold truncate pr-2">{chat.name}</h3>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {formatTime(chat.lastMessage?.timestamp)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[13px] truncate pr-4 ${chat.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                   {chat.lastMessage ? chat.lastMessage.text : 'Start a new conversation'}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-[#1D9BF0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
        {filteredChats.length === 0 && (
          <div className="text-center py-10 opacity-40">
            <p className="text-sm">No conversations found</p>
          </div>
        )}
      </div>

      {/* Footer / Settings Trigger */}
      <div className="p-4 border-t border-slate-100 mt-auto">
         <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium px-2 py-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
         </button>
      </div>
    </div>
  );
};

export default Sidebar;
