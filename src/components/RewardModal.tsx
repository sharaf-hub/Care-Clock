
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardModalProps {
  open: boolean;
  onClose: () => void;
  points: number;
}

const RewardModal: React.FC<RewardModalProps> = ({ open, onClose, points }) => {
  // Auto close after 5 seconds
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-4 relative">
            <div className="animate-pulse bg-primary-100 rounded-full p-8">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 absolute animate-scale-in" style={{ 
                  animationDelay: `${i * 0.2}s`,
                  top: `${20 + Math.sin(i * (Math.PI * 2 / 5)) * 60}%`,
                  left: `${20 + Math.cos(i * (Math.PI * 2 / 5)) * 60}%`
                }} />
              ))}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-primary mb-2">Great job!</h2>
          <p className="text-lg font-medium mb-1">You earned</p>
          <div className="text-3xl font-bold text-primary-500 mb-4 flex items-center">
            {points} <span className="ml-1">points</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Keep taking your medications on time to earn more points!</p>
          
          <Button onClick={onClose}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;
