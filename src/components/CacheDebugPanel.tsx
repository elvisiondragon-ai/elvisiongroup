import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cacheManager } from '@/utils/cacheManager';
import { useAudioCache } from '@/hooks/useAudioCache';
import { ChevronDown, ChevronRight, Trash2, RefreshCw } from 'lucide-react';

export function CacheDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<any>({});
  const { getCacheStats, clearAudioCache } = useAudioCache();

  const refreshStats = () => {
    const cacheStats = cacheManager.getStats();
    const audioStats = getCacheStats();
    setStats({ ...cacheStats, ...audioStats });
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, [getCacheStats]);

  if (!isExpanded) {
    return (
      <Card className="fixed bottom-4 right-4 p-3 bg-card/95 backdrop-blur-sm border-border/50 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          Cache Debug
          <Badge variant="secondary" className="text-xs">
            {stats.hitRate?.toFixed(1)}% hit
          </Badge>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-card/95 backdrop-blur-sm border-border/50 z-50 min-w-80 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-2 p-0"
        >
          <ChevronDown className="w-4 h-4" />
          Cache Debug Panel
        </Button>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshStats}
            className="p-1"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              cacheManager.clearAll();
              clearAudioCache();
              refreshStats();
            }}
            className="p-1"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {/* Cache Performance */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Performance</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/50 p-2 rounded">
              <div className="text-muted-foreground">Hit Rate</div>
              <div className="font-mono text-green-400">
                {stats.hitRate?.toFixed(1)}%
              </div>
            </div>
            <div className="bg-background/50 p-2 rounded">
              <div className="text-muted-foreground">Total Items</div>
              <div className="font-mono">{stats.totalItems || 0}</div>
            </div>
          </div>
        </div>

        {/* Audio Cache */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Audio Cache</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/50 p-2 rounded">
              <div className="text-muted-foreground">Files Cached</div>
              <div className="font-mono text-blue-400">
                {stats.audioFiles || 0}
              </div>
            </div>
            <div className="bg-background/50 p-2 rounded">
              <div className="text-muted-foreground">Size</div>
              <div className="font-mono text-blue-400">
                {stats.totalSizeMB || '0.00'} MB
              </div>
            </div>
          </div>
        </div>

        {/* Cache Status */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Status</h4>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              Active: {stats.activeItems || 0}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Expired: {stats.expiredItems || 0}
            </Badge>
          </div>
        </div>

        {/* Performance Impact */}
        <div className="text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Impact</div>
          <div>
            API calls reduced by ~{Math.min(90, (stats.hitRate || 0)).toFixed(0)}%
          </div>
          <div className="text-green-400">
            ⚡ {stats.audioFiles > 0 ? 'Offline audio ready' : 'Preloading audio...'}
          </div>
        </div>
      </div>
    </Card>
  );
}