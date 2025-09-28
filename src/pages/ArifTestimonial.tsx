import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Quote, Star, Play } from "lucide-react";

export function ArifTestimonial() {
  const [showModal, setShowModal] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-open modal when page loads
  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Optionally redirect back to home or previous page
    window.history.back();
  };

  const testimonialData = {
    name: "Arif - Pro User",
    text: "Berkali kali Lipat rezeki berdatangan setelah rutin mendengarkan Verse of eL Vision secara rutin. pertolongan dari Allah. Luar Biasa !",
    rating: 5,
    type: "video",
    videoIndex: 0
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-emerald-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/20">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-emerald-400" />
            Pengalaman Arif
          </h2>
          <Button
            onClick={handleClose}
            className="w-8 h-8 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{testimonialData.name}</h3>
              <div className="flex items-center gap-1">
                {[...Array(testimonialData.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial Text */}
          <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20">
            <p className="text-gray-200 leading-relaxed">
              "{testimonialData.text}"
            </p>
          </Card>

          {/* Video Section */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              Video Testimonial
            </h4>
            
            <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden border border-emerald-500/20 max-w-xs mx-auto relative group">
              <video 
                ref={videoRef}
                controls 
                className="w-full h-full object-cover"
                poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.jpg"
                onPlay={() => setShowPlayButton(false)}
                onPause={() => setShowPlayButton(true)}
              >
                <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play Button Overlay - Only show when video is paused */}
              {showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
                  <div 
                    onClick={() => {
                      videoRef.current?.play();
                      setShowPlayButton(false);
                    }}
                    className="w-16 h-16 bg-emerald-500/80 hover:bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-sm border-2 border-white/30"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-white flex items-center gap-2"
            >
              ✨ Semoga anda menjadi salah satunya segera ✨
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full opacity-30"></div>
      </div>
    </div>
  );
}