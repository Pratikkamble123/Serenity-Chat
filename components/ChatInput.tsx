
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, type?: Message['type'], mediaUrl?: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Logic for starting recording
    } else {
      // Stop and simulate send
      onSendMessage('', 'voice', 'mock-voice-url');
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100 relative">
      <div className="max-w-6xl mx-auto flex items-end gap-2">
        <div className="flex items-center gap-1 mb-1">
          <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        <div className="flex-grow bg-slate-100 rounded-2xl p-1 flex items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none max-h-32 scrollbar-hide outline-none placeholder:text-slate-400"
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-all mb-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1 mb-1">
          {text.trim() ? (
            <button 
              onClick={handleSend}
              className="p-3 bg-[#1D9BF0] text-white rounded-full hover:bg-[#1A8CD8] transition-all shadow-md active:scale-95"
            >
              <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={handleVoiceRecord}
              className={`p-3 rounded-full transition-all active:scale-95 ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
