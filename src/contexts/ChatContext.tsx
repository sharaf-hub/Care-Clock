
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage } from '@/types';

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  isListening: boolean;
  toggleListening: () => void;
  isProcessing: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (role === 'user') {
      setIsProcessing(true);
      
      // Simulate AI response - in a real app, you would call an API here
      setTimeout(() => {
        const responses = [
          "I can help you with your medications. What do you need?",
          "Remember to take your medication on time.",
          "Would you like me to set a reminder for your next dose?",
          "I've noted that information. Anything else you'd like to know about your medication?",
          "Your health is important. Is there anything specific you're concerned about?",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addMessage(randomResponse, 'assistant');
        speakResponse(randomResponse);
        
        setIsProcessing(false);
      }, 1000);
    }
  };
  
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chat_messages');
  };

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        addMessage, 
        clearMessages, 
        isListening, 
        toggleListening,
        isProcessing
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
