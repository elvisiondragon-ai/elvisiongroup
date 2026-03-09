import React from 'react';

interface AnimatedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WalkingCaterpillar: React.FC<AnimatedLoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative inline-block`}>
      <div className="caterpillar-walk">
        <svg viewBox="0 0 40 20" className="w-full h-full">
          {/* Caterpillar body segments */}
          <circle cx="8" cy="10" r="4" className="caterpillar-segment segment-1" fill="currentColor" opacity="0.9" />
          <circle cx="16" cy="10" r="3.5" className="caterpillar-segment segment-2" fill="currentColor" opacity="0.8" />
          <circle cx="24" cy="10" r="3" className="caterpillar-segment segment-3" fill="currentColor" opacity="0.7" />
          <circle cx="30" cy="10" r="2.5" className="caterpillar-segment segment-4" fill="currentColor" opacity="0.6" />
          
          {/* Eyes */}
          <circle cx="6" cy="8" r="0.8" fill="white" />
          <circle cx="10" cy="8" r="0.8" fill="white" />
          <circle cx="6.5" cy="7.5" r="0.4" fill="black" />
          <circle cx="9.5" cy="7.5" r="0.4" fill="black" />
        </svg>
      </div>
      
      <style jsx>{`
        .caterpillar-walk {
          animation: walk 2s ease-in-out infinite;
        }
        
        .caterpillar-segment {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .segment-1 { animation-delay: 0s; }
        .segment-2 { animation-delay: 0.1s; }
        .segment-3 { animation-delay: 0.2s; }
        .segment-4 { animation-delay: 0.3s; }
        
        @keyframes walk {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(2px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-1px) scale(1.05); }
          75% { transform: translateY(1px) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export const WalkingTurtle: React.FC<AnimatedLoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative inline-block`}>
      <div className="turtle-walk">
        <svg viewBox="0 0 32 20" className="w-full h-full">
          {/* Shell */}
          <ellipse cx="16" cy="12" rx="10" ry="6" className="turtle-shell" fill="currentColor" opacity="0.8" />
          
          {/* Shell pattern */}
          <ellipse cx="16" cy="12" rx="8" ry="4.5" fill="currentColor" opacity="0.6" />
          <ellipse cx="16" cy="12" rx="6" ry="3" fill="currentColor" opacity="0.4" />
          
          {/* Head */}
          <circle cx="8" cy="12" r="3" className="turtle-head" fill="currentColor" />
          
          {/* Eyes */}
          <circle cx="6.5" cy="10.5" r="0.7" fill="white" />
          <circle cx="6.2" cy="10.2" r="0.4" fill="black" />
          
          {/* Legs */}
          <ellipse cx="12" cy="17" rx="2" ry="1" className="turtle-leg leg-1" fill="currentColor" opacity="0.7" />
          <ellipse cx="20" cy="17" rx="2" ry="1" className="turtle-leg leg-2" fill="currentColor" opacity="0.7" />
          <ellipse cx="12" cy="7" rx="2" ry="1" className="turtle-leg leg-3" fill="currentColor" opacity="0.7" />
          <ellipse cx="20" cy="7" rx="2" ry="1" className="turtle-leg leg-4" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
      
      <style jsx>{`
        .turtle-walk {
          animation: turtle-move 3s ease-in-out infinite;
        }
        
        .turtle-head {
          animation: head-bob 3s ease-in-out infinite;
        }
        
        .turtle-leg {
          animation: leg-move 3s ease-in-out infinite;
        }
        
        .leg-1 { animation-delay: 0s; }
        .leg-2 { animation-delay: 0.5s; }
        .leg-3 { animation-delay: 1s; }
        .leg-4 { animation-delay: 1.5s; }
        
        @keyframes turtle-move {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(1px); }
        }
        
        @keyframes head-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-0.5px); }
        }
        
        @keyframes leg-move {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.8); }
        }
      `}</style>
    </div>
  );
};

export const FallingMeteor: React.FC<AnimatedLoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative inline-block overflow-hidden`}>
      <div className="meteor-container">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          {/* Meteor trail */}
          <defs>
            <linearGradient id="meteorTrail" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Trail */}
          <path 
            d="M2 2 L16 16 L14 18 L0 4 Z" 
            fill="url(#meteorTrail)" 
            className="meteor-trail"
          />
          
          {/* Meteor core */}
          <circle cx="16" cy="16" r="2" className="meteor-core" fill="currentColor" />
          <circle cx="16" cy="16" r="1.2" fill="white" opacity="0.8" />
          <circle cx="15.5" cy="15.5" r="0.5" fill="white" />
        </svg>
      </div>
      
      <style jsx>{`
        .meteor-container {
          animation: meteor-fall 2s ease-in infinite;
        }
        
        .meteor-core {
          animation: meteor-glow 2s ease-in-out infinite;
        }
        
        .meteor-trail {
          animation: trail-fade 2s ease-in infinite;
        }
        
        @keyframes meteor-fall {
          0% { transform: translate(-100%, -100%) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(100%, 100%) rotate(360deg); opacity: 0; }
        }
        
        @keyframes meteor-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 3px currentColor); }
          50% { filter: brightness(1.3) drop-shadow(0 0 6px currentColor); }
        }
        
        @keyframes trail-fade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Combined loader component that cycles through different animations
export const CuteLoader: React.FC<AnimatedLoaderProps & { type?: 'caterpillar' | 'turtle' | 'meteor' | 'cycle' }> = ({ 
  size = 'md', 
  className = '',
  type = 'cycle'
}) => {
  const [currentLoader, setCurrentLoader] = React.useState(0);
  const loaders = [WalkingCaterpillar, WalkingTurtle, FallingMeteor];

  React.useEffect(() => {
    if (type === 'cycle') {
      const interval = setInterval(() => {
        setCurrentLoader((prev) => (prev + 1) % loaders.length);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [type]);

  if (type === 'caterpillar') return <WalkingCaterpillar size={size} className={className} />;
  if (type === 'turtle') return <WalkingTurtle size={size} className={className} />;
  if (type === 'meteor') return <FallingMeteor size={size} className={className} />;

  const CurrentLoader = loaders[currentLoader];
  return <CurrentLoader size={size} className={className} />;
};