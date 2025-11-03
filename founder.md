import React from 'react';
import { Crown } from 'lucide-react';

const FounderBadge = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-8 p-8">
      <div className="text-white text-2xl font-bold mb-4">Founder Badge Variants</div>
      
      <div className="flex gap-6 items-center">
        <div className="text-center">
          <span
            className={`inline-flex items-center rounded-full font-semibold transition-all text-white relative overflow-hidden bg-gradient-to-r from-purple-600 via-amber-600 to-gray-600 hover:from-purple-700 hover:via-amber-700 hover:to-gray-700 border-2 border-white/30 shadow-2xl shadow-amber-500/25 ${sizeClasses.sm}`}
          >
            <Crown className={iconSizes.sm} />
            <span>FOUNDER</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </span>
          <div className="text-white/60 text-xs mt-2">Small</div>
        </div>

        <div className="text-center">
          <span
            className={`inline-flex items-center rounded-full font-semibold transition-all text-white relative overflow-hidden bg-gradient-to-r from-purple-600 via-amber-600 to-gray-600 hover:from-purple-700 hover:via-amber-700 hover:to-gray-700 border-2 border-white/30 shadow-2xl shadow-amber-500/25 ${sizeClasses.md}`}
          >
            <Crown className={iconSizes.md} />
            <span>FOUNDER</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </span>
          <div className="text-white/60 text-xs mt-2">Medium</div>
        </div>

        <div className="text-center">
          <span
            className={`inline-flex items-center rounded-full font-semibold transition-all text-white relative overflow-hidden bg-gradient-to-r from-purple-600 via-amber-600 to-gray-600 hover:from-purple-700 hover:via-amber-700 hover:to-gray-700 border-2 border-white/30 shadow-2xl shadow-amber-500/25 ${sizeClasses.lg}`}
          >
            <Crown className={iconSizes.lg} />
            <span>FOUNDER</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </span>
          <div className="text-white/60 text-xs mt-2">Large</div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-2xl">
        <h3 className="text-white font-bold mb-4">Badge Specifications:</h3>
        <ul className="text-white/80 text-sm space-y-2">
          <li>• <span className="font-semibold">Icon:</span> Crown (from lucide-react)</li>
          <li>• <span className="font-semibold">Label:</span> FOUNDER</li>
          <li>• <span className="font-semibold">Gradient:</span> Purple → Amber → Grey</li>
          <li>• <span className="font-semibold">Background:</span> from-purple-600 via-amber-600 to-gray-600</li>
          <li>• <span className="font-semibold">Hover:</span> from-purple-700 via-amber-700 to-gray-700</li>
          <li>• <span className="font-semibold">Border:</span> 2px white/30 opacity</li>
          <li>• <span className="font-semibold">Shadow:</span> 2xl with amber-500/25</li>
          <li>• <span className="font-semibold">Animation:</span> Shimmering pulse effect</li>
        </ul>
      </div>
    </div>
  );
};

export default FounderBadge;