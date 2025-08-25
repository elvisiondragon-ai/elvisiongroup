import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import { HLSPlayer } from "@/components/HLSPlayer";
import { ArrowLeft } from "lucide-react";

interface HLSTestProps {
  onNavigate: (tab: string) => void;
}

export function HLSTest({ onNavigate }: HLSTestProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('home')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            HLS vs Regular Audio Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare HLS streaming (protected) vs regular audio (downloadable)
          </p>
        </div>
      </div>

      {/* Test Instructions */}
      <Card className="p-6 bg-gradient-secondary border-border">
        <h2 className="text-xl font-semibold mb-4">Testing Instructions:</h2>
        <div className="space-y-2 text-sm">
          <p><strong>1. HLS Player:</strong> Try to download using browser tools/IDM - should be blocked</p>
          <p><strong>2. Regular Player:</strong> Right-click inspect, find audio URL - can be downloaded</p>
          <p><strong>3. Network Tab:</strong> See HLS loads segments (segment_000.ts, segment_001.ts, etc.)</p>
          <p><strong>4. Playback Quality:</strong> Both should sound identical - seamless playback</p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* HLS Player */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">🛡️ HLS Protected</h2>
          <HLSPlayer
            src="/hls-test/playlist.m3u8"
            title="Test Audio (HLS)"
            description="Segmented streaming - harder to download"
          />
          
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <h3 className="font-semibold text-green-400 mb-2">Protection Benefits:</h3>
            <ul className="text-sm space-y-1 text-green-300">
              <li>✅ No direct MP3 URL access</li>
              <li>✅ Segmented chunks (10s each)</li>
              <li>✅ Can add token authentication</li>
              <li>✅ IDM/downloaders blocked</li>
            </ul>
          </Card>
        </div>

        {/* Regular Player */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">📂 Regular Audio</h2>
          <AudioPlayer
            title="Test Audio (Direct)"
            src="/hls-test/test-audio.mp3"
            description="Direct MP3 - easy to download"
          />
          
          <Card className="p-4 bg-red-500/10 border-red-500/20">
            <h3 className="font-semibold text-red-400 mb-2">Security Issues:</h3>
            <ul className="text-sm space-y-1 text-red-300">
              <li>❌ Direct MP3 URL visible</li>
              <li>❌ Right-click save as works</li>
              <li>❌ IDM can download easily</li>
              <li>❌ Full file exposed</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Debug Info */}
      <Card className="p-6 bg-gradient-secondary border-border">
        <h3 className="text-lg font-semibold mb-4">Technical Details:</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">HLS Implementation:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• FFmpeg conversion to .m3u8 + .ts segments</li>
              <li>• HLS.js for browser compatibility</li>
              <li>• 10-second segments for smooth streaming</li>
              <li>• AAC encoding for better quality</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Production Considerations:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Add token-based authentication</li>
              <li>• CDN distribution for segments</li>
              <li>• Real-time conversion pipeline</li>
              <li>• Adaptive bitrate streaming</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}