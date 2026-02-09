
import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', showStatus = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-300',
    away: 'bg-yellow-500',
  };

  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden bg-slate-100 shadow-sm transition-transform duration-300 hover:scale-[1.05]`}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {showStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${statusColors[user.status] || 'bg-slate-400'}`}></div>
      )}
    </div>
  );
};

export default Avatar;
