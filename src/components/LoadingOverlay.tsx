import React from 'react';
import { CuteLoader } from './AnimatedLoaders';

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 backdrop-blur-sm">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        {/* Cute animated loader */}
        <div className="mb-8 p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CuteLoader size="lg" type="cycle" className="text-white w-16 h-16" />
        </div>
        
        {/* Loading message */}
        <div className="text-white text-xl font-semibold mb-2 animate-pulse">
          {message || 'Loading...'}
        </div>
        
        {/* Subtitle */}
        <div className="text-white/70 text-sm">
          Please wait while we prepare your content
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-1 mt-6">
          <div className="loading-dot dot-1"></div>
          <div className="loading-dot dot-2"></div>
          <div className="loading-dot dot-3"></div>
        </div>
      </div>
      
      <style jsx>{`
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }
        
        .particle-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
          animation-duration: 6s;
        }
        
        .particle-2 {
          top: 60%;
          left: 80%;
          animation-delay: 1s;
          animation-duration: 8s;
        }
        
        .particle-3 {
          top: 80%;
          left: 30%;
          animation-delay: 2s;
          animation-duration: 7s;
        }
        
        .particle-4 {
          top: 30%;
          left: 70%;
          animation-delay: 3s;
          animation-duration: 9s;
        }
        
        .particle-5 {
          top: 70%;
          left: 10%;
          animation-delay: 4s;
          animation-duration: 5s;
        }
        
        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          animation: bounce 1.4s ease-in-out infinite both;
        }
        
        .dot-1 { animation-delay: -0.32s; }
        .dot-2 { animation-delay: -0.16s; }
        .dot-3 { animation-delay: 0s; }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) translateX(-5px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-20px) translateX(-10px);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};