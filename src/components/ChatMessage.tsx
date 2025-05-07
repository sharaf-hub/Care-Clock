
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-primary text-white rounded-tr-none' 
            : 'bg-muted rounded-tl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70 block mt-1">
          {format(new Date(message.timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
