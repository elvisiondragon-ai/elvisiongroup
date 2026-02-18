import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Video, ExternalLink, Play } from "lucide-react";

interface AffiliateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AffiliateGuideModal({ isOpen, onClose }: AffiliateGuideModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 via-slate-950 to-purple-950 border border-purple-500/30 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <h2 className="text-xl font-bold font-exo text-white flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
              Affiliate Program
            </span>
          </h2>
          <Button
            onClick={onClose}
            className="w-9 h-9 p-0 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white rounded-full transition-all border border-white/10"
            variant="ghost"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* Main Action Button Section */}
          <div className="space-y-4">
             <div className="p-6 rounded-2xl bg-purple-900/10 border border-purple-500/20 backdrop-blur-sm text-center space-y-4 shadow-inner">
                <p className="text-purple-100 text-sm font-medium leading-relaxed">
                   Klik tombol di bawah untuk mengambil link affiliate Anda, lalu pilih menu <span className="text-fuchsia-400 font-bold">Uang Panas</span> dan cari konten <span className="text-fuchsia-400 font-bold">Lead Magnet</span> untuk di download.
                </p>
                <a href="https://app.elvisiongroup.com/affiliate" target="_blank" rel="noopener noreferrer" className="block group">
                   <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-lg font-bold border-0 shadow-[0_10px_20px_-10px_rgba(168,85,247,0.5)] group-hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.6)] group-hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-xl">
                      Ambil Affiliate Disini
                      <ExternalLink className="w-5 h-5 ml-2 opacity-80" />
                   </Button>
                </a>
             </div>
          </div>

          {/* Video Tutorial Section */}
          <div className="space-y-4 pb-4">
             <div className="flex items-center gap-2 px-1">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                   <Video className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Video Panduan</h3>
             </div>
             
             <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-2xl group ring-1 ring-purple-500/20 aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/cPwGC0NW8s4"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
             </div>
             
             <p className="text-center text-xs text-slate-500 font-medium italic">
                Klik tombol play untuk memulai panduan
             </p>
          </div>
          
        </div>

        {/* Footer static area */}
        <div className="p-4 bg-black/20 border-t border-white/5 text-center">
           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">eL Vision Ecosystem</p>
        </div>
      </div>
    </div>
  );
}
