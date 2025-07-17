import { ExternalLink, Tag, MoreVertical, Star, Heart, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAnimationPerformance } from "@/hooks/useIntersectionObserver";
import { useZoomPerformance } from "@/hooks/useZoomPerformance";
import { useState, useMemo } from "react";

interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags: string[];
  collection: string;
  createdAt: Date;
  favicon: string;
  isFavorite?: boolean;
  isRead?: boolean;
  readingTime?: number; // in minutes
  domain?: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: "grid" | "list";
  animationDelay?: number;
  showStatusBadges?: boolean;
  onStatusChange?: (id: string, status: 'favorite' | 'read', value: boolean) => void;
}

export const BookmarkCard = ({ 
  bookmark, 
  viewMode, 
  animationDelay = 0,
  showStatusBadges = true,
  onStatusChange 
}: BookmarkCardProps) => {
  const { shouldAnimate } = useAnimationPerformance();
  const { isZooming, shouldReduceAnimations } = useZoomPerformance();
  const [localFavorite, setLocalFavorite] = useState(bookmark.isFavorite || false);
  const [localRead, setLocalRead] = useState(bookmark.isRead || false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if animations should be active based on zoom state and performance
  const effectiveShouldAnimate = useMemo(() => {
    return shouldAnimate && !isZooming && !shouldReduceAnimations;
  }, [shouldAnimate, isZooming, shouldReduceAnimations]);
  
  const handleOpen = () => {
    window.open(bookmark.url, "_blank");
  };

  const handleStatusToggle = (status: 'favorite' | 'read') => {
    if (status === 'favorite') {
      const newValue = !localFavorite;
      setLocalFavorite(newValue);
      onStatusChange?.(bookmark.id, 'favorite', newValue);
    } else if (status === 'read') {
      const newValue = !localRead;
      setLocalRead(newValue);
      onStatusChange?.(bookmark.id, 'read', newValue);
    }
  };

  // Extract domain from URL for better display
  const domain = bookmark.domain || new URL(bookmark.url).hostname.replace('www.', '');
  
  // Format reading time
  const readingTimeText = bookmark.readingTime ? `${bookmark.readingTime} min read` : null;

  if (viewMode === "list") {
    return (
      <div 
        className={`glass-card-enhanced p-3 sm:p-4 group ${effectiveShouldAnimate ? 'transition-glass' : ''}`}
        onMouseEnter={() => effectiveShouldAnimate && setIsHovered(true)}
        onMouseLeave={() => effectiveShouldAnimate && setIsHovered(false)}
        style={effectiveShouldAnimate && isHovered ? { 
          transform: 'translateY(-4px)', 
          boxShadow: 'var(--shadow-glass-lg)',
          willChange: 'transform, box-shadow'
        } : { willChange: 'auto' }}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Compact thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={bookmark.thumbnail}
                alt={bookmark.title}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover"
                style={effectiveShouldAnimate && isHovered ? { 
                  transform: 'scale(1.05)', 
                  transition: 'transform 0.2s ease-out' 
                } : {}}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=56&h=56&fit=crop";
                }}
              />
              {/* Subtle overlay on hover */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                style={effectiveShouldAnimate && isHovered ? { 
                  opacity: 1, 
                  transition: 'opacity 0.3s ease-out' 
                } : { opacity: 0 }}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Compact header section */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold text-sm sm:text-base text-foreground cursor-pointer line-clamp-1 leading-tight mb-1" 
                  style={effectiveShouldAnimate && isHovered ? { 
                    color: 'hsl(var(--primary))', 
                    transition: 'color 0.2s ease-out' 
                  } : {}}
                  onClick={handleOpen}
                >
                  {bookmark.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 leading-relaxed">
                  {bookmark.description}
                </p>
              </div>
              
              {/* Compact action buttons */}
              <div className="flex items-center gap-1">
                <Button 
                  variant="glass-secondary" 
                  size="icon" 
                  onClick={handleOpen} 
                  className="h-7 w-7 shadow-glass-sm"
                  style={effectiveShouldAnimate && isHovered ? { 
                    transform: 'scale(1.05)', 
                    boxShadow: 'var(--shadow-glass-md)',
                    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' 
                  } : {}}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="glass-secondary" 
                      size="icon" 
                      className="h-7 w-7 shadow-glass-sm"
                      style={effectiveShouldAnimate && isHovered ? { 
                        transform: 'scale(1.05)', 
                        boxShadow: 'var(--shadow-glass-md)',
                        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' 
                      } : {}}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card-enhanced">
                    <DropdownMenuItem onClick={() => handleStatusToggle('favorite')}>
                      <Heart className="w-4 h-4 mr-2" />
                      {localFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusToggle('read')}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      {localRead ? 'Mark as Unread' : 'Mark as Read'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Move to Collection</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Compact metadata and status in single row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img src={bookmark.favicon} alt="" className="w-3 h-3 rounded-sm flex-shrink-0" />
                  <span className="font-medium text-foreground/80 truncate">{domain}</span>
                </div>
                
                {readingTimeText && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{readingTimeText}</span>
                    </div>
                  </>
                )}
                
                <span className="text-muted-foreground/60">•</span>
                <span className="text-muted-foreground font-medium flex-shrink-0">
                  {bookmark.createdAt.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: bookmark.createdAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })}
                </span>
              </div>

              {/* Compact status indicators */}
              {showStatusBadges && (localFavorite || localRead) && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {localFavorite && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-red-600 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50">
                      <Heart className="w-2.5 h-2.5 fill-current" />
                      <span className="hidden sm:inline">Fav</span>
                    </div>
                  )}
                  {localRead && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                      <BookOpen className="w-2.5 h-2.5 fill-current" />
                      <span className="hidden sm:inline">Read</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Compact tags and collection in single row */}
            <div className="flex items-center justify-between gap-2">
              {/* Tags */}
              {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 min-w-0 flex-1">
                  {bookmark.tags.slice(0, 2).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-gradient-glass-tertiary border-white/30 font-medium cursor-pointer"
                    >
                      <Tag className="w-2.5 h-2.5 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {bookmark.tags.length > 2 && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-gradient-glass-tertiary border-white/30 opacity-75 font-medium"
                    >
                      +{bookmark.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Collection indicator */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-primary"></div>
                <span className="text-xs font-medium text-foreground/70">{bookmark.collection}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Apply staggered animation styles
  const animationStyle = shouldAnimate && animationDelay > 0 ? {
    animationDelay: `${animationDelay}ms`,
  } : {};

  return (
    <div 
      className={`glass-card-enhanced group overflow-hidden relative ${
        effectiveShouldAnimate ? 'animate-fade-in-up transition-glass no-hover-transform' : ''
      }`}
      style={{
        ...animationStyle,
        ...(effectiveShouldAnimate && isHovered ? { 
          transform: 'translateY(-8px) scale(1.02)', 
          boxShadow: 'var(--shadow-glass-xl)',
          willChange: 'transform, box-shadow'
        } : { willChange: 'auto' })
      }}
      onMouseEnter={() => effectiveShouldAnimate && setIsHovered(true)}
      onMouseLeave={() => effectiveShouldAnimate && setIsHovered(false)}
    >
      {/* Enhanced image section with improved gradient overlay */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title}
          className="w-full h-full object-cover"
          style={effectiveShouldAnimate && isHovered ? { 
            transform: 'scale(1.1)', 
            transition: 'transform 0.5s ease-out',
            willChange: 'transform'
          } : { willChange: 'auto' }}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=200&fit=crop";
          }}
        />
        
        {/* Enhanced gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
          style={effectiveShouldAnimate && isHovered ? { 
            opacity: 1, 
            transition: 'opacity 0.3s ease-out' 
          } : { opacity: 0 }}
        />
        
        {/* Floating status badges */}
        {showStatusBadges && (
          <div className="absolute top-2 left-2 flex gap-1">
            {localFavorite && (
              <div className="glass-card-tertiary px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-red-600 shadow-glass-sm">
                <Heart className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Favorite</span>
              </div>
            )}
            {localRead && (
              <div className="glass-card-tertiary px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-green-600 shadow-glass-sm">
                <BookOpen className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Read</span>
              </div>
            )}
          </div>
        )}
        
        {/* Enhanced dropdown menu with consistent glassmorphic styling */}
        <div 
          className="absolute top-2 right-2"
          style={effectiveShouldAnimate ? {
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          } : { opacity: 1 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="glass-card-tertiary p-2 rounded-lg shadow-glass-sm cursor-pointer">
                <MoreVertical className="h-4 w-4 text-foreground/70" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card-enhanced">
              <DropdownMenuItem onClick={() => handleStatusToggle('favorite')}>
                <Heart className="w-4 h-4 mr-2" />
                {localFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusToggle('read')}>
                <BookOpen className="w-4 h-4 mr-2" />
                {localRead ? 'Mark as Unread' : 'Mark as Read'}
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Move to Collection</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Enhanced content section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className="font-semibold text-base text-foreground cursor-pointer line-clamp-2 flex-1" 
            style={effectiveShouldAnimate && isHovered ? { 
              color: 'hsl(var(--primary))', 
              transition: 'color 0.2s ease-out' 
            } : {}}
            onClick={handleOpen}
          >
            {bookmark.title}
          </h3>
          <Button 
            variant="glass-secondary" 
            size="icon" 
            onClick={handleOpen} 
            className="h-8 w-8 flex-shrink-0 ml-2 shadow-glass-sm hover:shadow-glass-md"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {bookmark.description}
        </p>
        
        {/* Enhanced metadata section */}
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <img src={bookmark.favicon} alt="" className="w-4 h-4 rounded-sm" />
          <span className="font-medium text-foreground/80">{domain}</span>
          {readingTimeText && (
            <>
              <span className="text-muted-foreground/60">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTimeText}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Enhanced tags section */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-gradient-glass-tertiary border-white/20"
              >
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-gradient-glass-tertiary border-white/20 opacity-75"
              >
                +{bookmark.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Enhanced footer section */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground/70">{bookmark.collection}</span>
          </div>
          <span className="text-muted-foreground">
            {bookmark.createdAt.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: bookmark.createdAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
            })}
          </span>
        </div>
      </div>
    </div>
  );
};