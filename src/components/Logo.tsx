
import React from 'react';
import { Clock } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizes = {
    sm: { icon: 20, text: 'text-xl' },
    md: { icon: 24, text: 'text-2xl' },
    lg: { icon: 32, text: 'text-3xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full p-1.5 bg-primary-300 text-white`}>
        <Clock size={sizes[size].icon} strokeWidth={2.5} />
      </div>
      {withText && (
        <span className={`font-bold ${sizes[size].text} bg-gradient-to-r from-primary-500 to-primary-300 text-transparent bg-clip-text`}>
          Care Clock
        </span>
      )}
    </div>
  );
};

export default Logo;
