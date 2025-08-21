import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Star } from 'lucide-react';
import { useVerseAccess, type VerseAccess } from '@/hooks/useVerseAccess';
import { usePro } from '@/hooks/usePro';
import { cn } from '@/lib/utils';

interface VerseCardProps {
  verseNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  onNavigate?: () => void;
}

export function VerseCard({ verseNumber, title, description, imageUrl, onNavigate }: VerseCardProps) {
  const { checkVerseAccess, handleVerseClick } = useVerseAccess();
  const { proStatus } = usePro();
  const access = checkVerseAccess(verseNumber);

  const getAccessBadge = (access: VerseAccess) => {
    if (access.canAccess) {
      if (access.reason === 'pro') {
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Pro Access
          </Badge>
        );
      } else {
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Star className="w-3 h-3 mr-1" />
            Unlocked
          </Badge>
        );
      }
    } else {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600">
          <Lock className="w-3 h-3 mr-1" />
          Level {access.requiredLevel} Required
        </Badge>
      );
    }
  };

  const handleClick = () => {
    handleVerseClick(verseNumber, onNavigate);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        access.canAccess ? "hover:scale-105" : "opacity-60 cursor-not-allowed"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {imageUrl && (
          <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={imageUrl} 
              alt={title}
              className={cn(
                "w-full h-full object-cover",
                !access.canAccess && "grayscale"
              )}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-semibold",
              access.canAccess ? "text-foreground" : "text-muted-foreground"
            )}>
              {title}
            </h3>
            {getAccessBadge(access)}
          </div>
          
          <p className={cn(
            "text-sm",
            access.canAccess ? "text-muted-foreground" : "text-muted-foreground/60"
          )}>
            {description}
          </p>
          
          {!access.canAccess && !proStatus.isPro && (
            <p className="text-xs text-amber-600 mt-2">
              💡 Upgrade to Pro for instant access to all verses!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}