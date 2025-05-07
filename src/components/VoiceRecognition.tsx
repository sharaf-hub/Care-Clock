
import React, { useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VoiceRecognition: React.FC = () => {
  const { isListening, toggleListening, addMessage } = useChat();
  
  useEffect(() => {
    let recognition: SpeechRecognition | null = null;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, 'user');
        toggleListening();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toggleListening();
      };
      
      recognition.onend = () => {
        if (isListening) {
          recognition?.start();
        }
      };
      
      if (isListening) {
        recognition.start();
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, toggleListening, addMessage]);
  
  return (
    <Button 
      onClick={toggleListening}
      variant={isListening ? "destructive" : "default"}
      size="sm"
      className="rounded-full"
      title={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <MicOff /> : <Mic />}
    </Button>
  );
};

export default VoiceRecognition;
