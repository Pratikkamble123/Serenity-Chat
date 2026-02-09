
import React, { useRef, useEffect } from 'react';
import { Chat, Message, User } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import Avatar from './Avatar';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  typingUsers: string[];
  onSendMessage: (text: string, type?: Message['type'], mediaUrl?: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  chat, 
  messages, 
  currentUser, 
  typingUsers,
  onSendMessage,
  onToggleReaction,
  onBack 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  const groupMessages = (msgs: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];

    msgs.forEach((msg, idx) => {
      const prevMsg = msgs[idx - 1];
      const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
      const isWithinTimeLimit = prevMsg && (msg.timestamp.getTime() - prevMsg.timestamp.getTime()) < 120000; // 2 mins

      if (isSameSender && isWithinTimeLimit) {
        currentGroup.push(msg);
      } else {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [msg];
      }
    });

    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  };

  const messageGroups = groupMessages(messages);

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Avatar user={{ avatar: chat.avatar || '', name: chat.name || '' } as User} size="lg" />
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 truncate">{chat.name}</h2>
            <div className="flex items-center gap-1.5 overflow-hidden">
              {typingUsers.length > 0 ? (
                <TypingIndicator />
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  {chat.type === 'group' ? `${chat.participants.length} members` : 'online'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth"
      >
        {messageGroups.map((group, gIdx) => (
          <div key={`group-${gIdx}`} className="space-y-1">
            {group.map((msg, mIdx) => (
              <MessageBubble 
                key={msg.id}
                message={msg}
                isMe={msg.senderId === currentUser.id}
                isFirstInGroup={mIdx === 0}
                isLastInGroup={mIdx === group.length - 1}
                onToggleReaction={onToggleReaction}
              />
            ))}
          </div>
        ))}
        {typingUsers.length > 0 && (
           <div className="flex items-center gap-2 mt-4 animate-pulse opacity-70">
              <div className="bg-white px-4 py-2 rounded-2xl text-[12px] text-slate-500 shadow-sm border border-slate-100 flex items-center gap-1">
                someone is typing <span className="flex gap-0.5"><span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span><span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75"></span><span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></span></span>
              </div>
           </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
