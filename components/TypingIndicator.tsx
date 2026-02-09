
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <div className="flex gap-0.5 items-center">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
      <span className="text-[11px] text-green-600 font-semibold tracking-tight uppercase">typing...</span>
    </div>
  );
};

export default TypingIndicator;
