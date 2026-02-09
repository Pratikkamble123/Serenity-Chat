
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { AppState, Chat, Message, User, Reaction } from './types';
import { CURRENT_USER, INITIAL_CHATS, INITIAL_MESSAGES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: CURRENT_USER,
    chats: INITIAL_CHATS,
    messages: INITIAL_MESSAGES,
    activeChatId: INITIAL_CHATS[0].id,
    typingUsers: {},
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simulated "Real-time" interaction
  useEffect(() => {
    if (state.activeChatId === 'c-1') {
      const timer = setTimeout(() => {
        handleTyping('c-1', 'u-1', true);
        setTimeout(() => {
          handleTyping('c-1', 'u-1', false);
          const autoMsg: Message = {
            id: `m-auto-${Date.now()}`,
            chatId: 'c-1',
            senderId: 'u-1',
            text: 'They’re definitely shaping the future of digital interaction.',
            timestamp: new Date(),
            status: 'sent',
            reactions: [],
            type: 'text',
          };
          addMessage('c-1', autoMsg);
        }, 3000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.activeChatId]);

  const addMessage = (chatId: string, message: Message) => {
    setState(prev => {
      const chatMessages = prev.messages[chatId] || [];
      return {
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: [...chatMessages, message],
        },
        chats: prev.chats.map(chat => 
          chat.id === chatId ? { ...chat, lastMessage: message } : chat
        )
      };
    });
  };

  const handleTyping = (chatId: string, userId: string, isTyping: boolean) => {
    setState(prev => {
      const currentTyping = prev.typingUsers[chatId] || [];
      const updated = isTyping 
        ? [...new Set([...currentTyping, userId])]
        : currentTyping.filter(id => id !== userId);
      return {
        ...prev,
        typingUsers: { ...prev.typingUsers, [chatId]: updated }
      };
    });
  };

  const handleSendMessage = (text: string, type: Message['type'] = 'text', mediaUrl?: string) => {
    if (!state.activeChatId) return;
    
    const newMessage: Message = {
      id: `m-me-${Date.now()}`,
      chatId: state.activeChatId,
      senderId: state.currentUser.id,
      text,
      timestamp: new Date(),
      status: 'sending',
      reactions: [],
      type,
      mediaUrl,
    };

    addMessage(state.activeChatId, newMessage);

    // Simulate server success
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [state.activeChatId!]: prev.messages[state.activeChatId!].map(m => 
            m.id === newMessage.id ? { ...m, status: 'sent' } : m
          )
        }
      }));
    }, 1000);
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!state.activeChatId) return;

    setState(prev => {
      const chatMessages = prev.messages[state.activeChatId!] || [];
      const updatedMessages = chatMessages.map(msg => {
        if (msg.id !== messageId) return msg;

        const existingReactionIndex = msg.reactions.findIndex(
          r => r.emoji === emoji && r.userId === prev.currentUser.id
        );

        let newReactions: Reaction[];
        if (existingReactionIndex > -1) {
          // Remove reaction
          newReactions = msg.reactions.filter((_, i) => i !== existingReactionIndex);
        } else {
          // Add reaction
          newReactions = [...msg.reactions, { emoji, userId: prev.currentUser.id }];
        }

        return { ...msg, reactions: newReactions };
      });

      return {
        ...prev,
        messages: {
          ...prev.messages,
          [state.activeChatId!]: updatedMessages
        }
      };
    });
  };

  const activeChat = state.chats.find(c => c.id === state.activeChatId);

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-800 antialiased">
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 bg-white z-20`}>
        <Sidebar 
          currentUser={state.currentUser}
          chats={state.chats}
          activeChatId={state.activeChatId}
          onSelectChat={(id) => {
            setState(prev => ({ ...prev, activeChatId: id }));
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className={`flex-grow flex flex-col bg-[#F0F2F5] transition-all duration-300 relative ${!isSidebarOpen ? 'z-30' : 'z-10'}`}>
        {state.activeChatId && activeChat ? (
          <ChatWindow 
            chat={activeChat}
            messages={state.messages[state.activeChatId] || []}
            currentUser={state.currentUser}
            typingUsers={state.typingUsers[state.activeChatId] || []}
            onSendMessage={handleSendMessage}
            onToggleReaction={handleToggleReaction}
            onBack={() => setIsSidebarOpen(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-60 text-center px-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
               <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Your Space is Ready</h2>
            <p className="max-w-xs text-sm leading-relaxed">Select a conversation to start chatting. Everything is synced and secure.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
