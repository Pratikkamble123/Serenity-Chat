
import React, { useState } from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, isFirstInGroup, isLastInGroup, onToggleReaction }) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    if (!isMe) return null;
    switch (message.status) {
      case 'sending': return (
        <svg className="w-3 h-3 text-slate-400 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" className="opacity-75" />
        </svg>
      );
      case 'sent': return (
        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'delivered': return (
        <div className="flex -space-x-1.5">
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
      case 'read': return (
        <div className="flex -space-x-1.5">
          <svg className="w-3 h-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <svg className="w-3 h-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
  };

  // Group reactions by emoji
  const reactionGroups = message.reactions.reduce((acc, curr) => {
    acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div 
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full group relative px-1 mb-2`}
      onMouseLeave={() => setShowPicker(false)}
    >
      <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>
        {/* Floating Reaction Picker Button (Appears on hover) */}
        <button 
          onClick={() => setShowPicker(!showPicker)}
          className={`
            absolute -top-2 ${isMe ? '-left-8' : '-right-8'} 
            p-1.5 rounded-full bg-white shadow-md border border-slate-100 
            text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity z-20
            hover:text-slate-600 hover:scale-110
          `}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Floating Emoji Bar */}
        {showPicker && (
          <div className={`
            absolute -top-10 ${isMe ? 'right-0' : 'left-0'} 
            bg-white shadow-xl border border-slate-100 rounded-full px-2 py-1 
            flex gap-1.5 z-30 animate-in fade-in zoom-in duration-200
          `}>
            {COMMON_EMOJIS.map(emoji => (
              <button 
                key={emoji} 
                onClick={() => {
                  onToggleReaction(message.id, emoji);
                  setShowPicker(false);
                }}
                className="hover:scale-125 transition-transform p-1 text-lg leading-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div 
          className={`
            px-4 py-2.5 shadow-sm text-[15px] leading-relaxed relative
            ${isMe 
              ? 'bg-[#D9FDD3] text-slate-800 rounded-2xl rounded-tr-none' 
              : 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100'
            }
            ${!isFirstInGroup && (isMe ? 'rounded-tr-2xl' : 'rounded-tl-2xl')}
            ${!isLastInGroup && (isMe ? 'rounded-br-none' : 'rounded-bl-none')}
            transition-transform duration-200 hover:scale-[1.005]
          `}
        >
          {message.type === 'voice' ? (
            <div className="flex items-center gap-3 py-1 min-w-[180px]">
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                 <svg className="w-4 h-4 fill-current text-slate-600" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <div className="flex-grow h-1 bg-slate-200 rounded-full relative">
                 <div className="absolute left-0 top-0 h-full bg-slate-400 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="text-[11px] font-medium opacity-60">0:12</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}

          <div className={`flex items-center gap-1.5 mt-1.5 justify-end opacity-60 text-[10px] select-none font-medium`}>
            <span>{formatTime(message.timestamp)}</span>
            {getStatusIcon()}
          </div>
        </div>

        {/* Reaction Display */}
        {Object.entries(reactionGroups).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {/* Fix: Explicitly cast Object.entries to ensure count is inferred as a number to avoid unknown type comparison error */}
            {(Object.entries(reactionGroups) as [string, number][]).map(([emoji, count]) => (
              <button 
                key={emoji}
                onClick={() => onToggleReaction(message.id, emoji)}
                className={`
                  bg-white border border-slate-100 shadow-sm rounded-full 
                  px-2 py-0.5 text-[12px] flex items-center gap-1
                  hover:bg-slate-50 transition-colors active:scale-95
                  ${message.reactions.some(r => r.emoji === emoji && r.userId === 'u-me') ? 'border-[#1D9BF0] bg-blue-50/50' : ''}
                `}
              >
                <span>{emoji}</span>
                {count > 1 && <span className="font-semibold text-slate-500 text-[10px]">{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
