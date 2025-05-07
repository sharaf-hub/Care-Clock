
import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerTrigger 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

const ChatDrawer: React.FC = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="h-full mx-auto w-full max-w-md">
          <ChatInterface />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;
