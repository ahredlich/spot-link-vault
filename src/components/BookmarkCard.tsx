import { ExternalLink, Tag, MoreVertical, Heart, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAnimationPerformance } from "@/hooks/useIntersectionObserver";
import { useZoomPerformance } from "@/hooks/useZoomPerformance";
import { useState, useMemo, useCallback, memo, useRef, useEffect } from "react";



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
  enablePerformanceMonitoring?: boolean;
}

/**
 * BookmarkCard component optimized for performance with React.memo, useCallback, and useMemo.
 * 
 * Performance optimizations:
 * - React.memo with custom comparison function prevents unnecessary re-renders
 * - useMemo for expensive calculations (domain parsing, date formatting, tag processing)
 * - useCallback for event handlers to prevent child component re-renders
 * - Memoized animation styles and visible tags computation
 * - Optional performance monitoring for render tracking
 * 
 * Benefits:
 * - Prevents re-renders when parent component updates but props haven't changed
 * - Reduces expensive URL parsing and date formatting on every render
 * - Stable function references prevent unnecessary child component updates
 * - Optimized tag processing avoids array slicing on every render
 */
const BookmarkCardComponent = ({ 
  bookmark, 
  viewMode, 
  animationDelay = 0,
  showStatusBadges = true,
  onStatusChange,
  enablePerformanceMonitoring = false
}: BookmarkCardProps) => {
  const { shouldAnimate } = useAnimationPerformance();
  const { isZooming, shouldReduceAnimations } = useZoomPerformance();
  const [localFavorite, setLocalFavorite] = useState(bookmark.isFavorite || false);
  const [localRead, setLocalRead] = useState(bookmark.isRead || false);
  
  // Performance monitoring (optional)
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(performance.now());
  
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      renderCountRef.current += 1;
      const currentTime = performance.now();
      const timeSinceLastRender = currentTime - lastRenderTime.current;
      
      if (renderCountRef.current > 1) {
        console.log(`BookmarkCard ${bookmark.id} - Render #${renderCountRef.current} (${timeSinceLastRender.toFixed(2)}ms since last)`);
      }
      
      lastRenderTime.current = currentTime;
    }
  });
  
  // Determine if animations should be active based on zoom state and performance
  const effectiveShouldAnimate = useMemo(() => {
    return shouldAnimate && !isZooming && !shouldReduceAnimations;
  }, [shouldAnimate, isZooming, shouldReduceAnimations]);
  
  // Memoized expensive calculations
  const domain = useMemo(() => {
    if (bookmark.domain) return bookmark.domain;
    try {
      return new URL(bookmark.url).hostname.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  }, [bookmark.domain, bookmark.url]);
  
  const readingTimeText = useMemo(() => {
    return bookmark.readingTime ? `${bookmark.readingTime} min read` : null;
  }, [bookmark.readingTime]);

  const formattedDate = useMemo(() => {
    return bookmark.createdAt.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: bookmark.createdAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }, [bookmark.createdAt]);

  const animationStyle = useMemo(() => {
    return effectiveShouldAnimate && animationDelay > 0 ? {
      animationDelay: `${animationDelay}ms`,
    } : {};
  }, [effectiveShouldAnimate, animationDelay]);

  const visibleTags = useMemo(() => {
    const maxTags = viewMode === 'list' ? 2 : 3;
    return {
      shown: bookmark.tags.slice(0, maxTags),
      remaining: Math.max(0, bookmark.tags.length - maxTags)
    };
  }, [bookmark.tags, viewMode]);
  
  // Memoized event handlers
  const handleOpen = useCallback(() => {
    window.open(bookmark.url, "_blank");
  }, [bookmark.url]);

  const handleStatusToggle = useCallback((status: 'favorite' | 'read') => {
    if (status === 'favorite') {
      const newValue = !localFavorite;
      setLocalFavorite(newValue);
      onStatusChange?.(bookmark.id, 'favorite', newValue);
    } else if (status === 'read') {
      const newValue = !localRead;
      setLocalRead(newValue);
      onStatusChange?.(bookmark.id, 'read', newValue);
    }
  }, [bookmark.id, localFavorite, localRead, onStatusChange]);

  const handleFavoriteToggle = useCallback(() => {
    handleStatusToggle('favorite');
  }, [handleStatusToggle]);

  const handleReadToggle = useCallback(() => {
    handleStatusToggle('read');
  }, [handleStatusToggle]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const fallbackUrl = viewMode === 'list' 
      ? "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=56&h=56&fit=crop"
      : "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=200&fit=crop";
    target.src = fallbackUrl;
  }, [viewMode]);

  if (viewMode === "list") {
    return (
      <div 
        className={`glass-card-enhanced group overflow-hidden relative transition-glass-hover hover:shadow-glass-lg hover:-translate-y-0.5 ${
          effectiveShouldAnimate ? 'animate-fade-in-up' : ''
        }`}
        style={animationStyle}
      >
        <div className="flex items-start gap-4 p-4">
          {/* Enhanced thumbnail with micro-interactions */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-scale">
              <img
                src={bookmark.thumbnail}
                alt={bookmark.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover transition-all duration-300"
                onError={handleImageError}
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-fade" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            {/* Enhanced header section with better spacing */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <h3 
                  className="font-semibold text-base sm:text-lg text-foreground cursor-pointer line-clamp-2 leading-snug hover:text-primary transition-colors group-hover:text-primary/90" 
                  onClick={handleOpen}
                >
                  {bookmark.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {bookmark.description}
                </p>
              </div>
              
              {/* Enhanced action buttons with micro-interactions */}
              <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="glass-secondary" 
                  size="icon" 
                  onClick={handleOpen} 
                  className="h-8 w-8 shadow-glass-sm hover:shadow-glass-md hover:scale-105 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="glass-secondary" 
                      size="icon" 
                      className="h-8 w-8 shadow-glass-sm hover:shadow-glass-md hover:scale-105 transition-all"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card-tertiary">
                    <DropdownMenuItem onClick={handleFavoriteToggle}>
                      <Heart className="w-4 h-4 mr-2" />
                      {localFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReadToggle}>
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
            
            {/* Enhanced metadata section with better visual hierarchy */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <img src={bookmark.favicon} alt="" className="w-4 h-4 rounded-sm flex-shrink-0" />
                <span className="font-medium text-foreground/80 truncate">{domain}</span>
              </div>
              
              {readingTimeText && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{readingTimeText}</span>
                  </div>
                </>
              )}
              
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground font-medium flex-shrink-0">
                {formattedDate}
              </span>
            </div>

            {/* Enhanced status indicators and tags section */}
            <div className="flex items-center justify-between gap-3">
              {/* Enhanced tags with gradient backgrounds */}
              {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 min-w-0 flex-1">
                  {visibleTags.shown.map((tag, index) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-2.5 py-1 bg-gradient-glass-tertiary border-white/20 font-medium cursor-pointer hover:bg-gradient-glass-secondary hover:scale-105 transition-all duration-200 shadow-glass-sm hover:shadow-glass-md"
                      style={{
                        animationDelay: effectiveShouldAnimate ? `${(index + 1) * 50}ms` : '0ms'
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {tag}
                    </Badge>
                  ))}
                  {visibleTags.remaining > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2.5 py-1 bg-gradient-glass-tertiary border-white/20 opacity-75 font-medium hover:opacity-100 transition-opacity"
                    >
                      +{visibleTags.remaining}
                    </Badge>
                  )}
                </div>
              )}

              {/* Enhanced status indicators and collection */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Enhanced status badges */}
                {showStatusBadges && (localFavorite || localRead) && (
                  <div className="flex items-center gap-2">
                    {localFavorite && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 shadow-glass-sm hover:shadow-glass-md hover:scale-105 transition-all cursor-pointer">
                        <Heart className="w-3 h-3 fill-current" />
                        <span>Favorite</span>
                      </div>
                    )}
                    {localRead && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 shadow-glass-sm hover:shadow-glass-md hover:scale-105 transition-all cursor-pointer">
                        <BookOpen className="w-3 h-3 fill-current" />
                        <span>Read</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced collection indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-glass-secondary border border-white/20 shadow-glass-sm hover:shadow-glass-md hover:scale-105 transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                  <span className="text-xs font-medium text-foreground/80">{bookmark.collection}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`glass-card-enhanced group overflow-hidden relative ${
        effectiveShouldAnimate ? 'animate-fade-in-up' : ''
      }`}
      style={animationStyle}
    >
      {/* Enhanced image section with improved gradient overlay */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title}
          className="w-full h-full object-cover transition-scale group-hover:scale-105"
          onError={handleImageError}
        />
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-fade" />
        
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
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-fade">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="glass-card-tertiary p-2 rounded-lg shadow-glass-sm cursor-pointer">
                <MoreVertical className="h-4 w-4 text-foreground/70" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card-tertiary">
              <DropdownMenuItem onClick={handleFavoriteToggle}>
                <Heart className="w-4 h-4 mr-2" />
                {localFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReadToggle}>
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
            className="font-semibold text-base text-foreground cursor-pointer line-clamp-2 flex-1 hover:text-primary transition-colors" 
            onClick={handleOpen}
          >
            {bookmark.title}
          </h3>
          <Button 
            variant="glass-secondary" 
            size="icon" 
            onClick={handleOpen} 
            className="h-8 w-8 flex-shrink-0 ml-2 shadow-glass-sm hover:shadow-glass-md transition-shadow"
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
            {visibleTags.shown.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-gradient-glass-tertiary border-white/20"
              >
                {tag}
              </Badge>
            ))}
            {visibleTags.remaining > 0 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-gradient-glass-tertiary border-white/20 opacity-75"
              >
                +{visibleTags.remaining}
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
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

// Custom comparison function for React.memo
const areBookmarkPropsEqual = (prevProps: BookmarkCardProps, nextProps: BookmarkCardProps) => {
  // Check if the bookmark object has changed (deep comparison of relevant fields)
  const prevBookmark = prevProps.bookmark;
  const nextBookmark = nextProps.bookmark;
  
  if (prevBookmark.id !== nextBookmark.id) return false;
  if (prevBookmark.title !== nextBookmark.title) return false;
  if (prevBookmark.description !== nextBookmark.description) return false;
  if (prevBookmark.url !== nextBookmark.url) return false;
  if (prevBookmark.thumbnail !== nextBookmark.thumbnail) return false;
  if (prevBookmark.favicon !== nextBookmark.favicon) return false;
  if (prevBookmark.collection !== nextBookmark.collection) return false;
  if (prevBookmark.isFavorite !== nextBookmark.isFavorite) return false;
  if (prevBookmark.isRead !== nextBookmark.isRead) return false;
  if (prevBookmark.readingTime !== nextBookmark.readingTime) return false;
  if (prevBookmark.domain !== nextBookmark.domain) return false;
  if (prevBookmark.createdAt?.getTime() !== nextBookmark.createdAt?.getTime()) return false;
  
  // Check if tags array has changed
  if (prevBookmark.tags.length !== nextBookmark.tags.length) return false;
  for (let i = 0; i < prevBookmark.tags.length; i++) {
    if (prevBookmark.tags[i] !== nextBookmark.tags[i]) return false;
  }
  
  // Check other props
  if (prevProps.viewMode !== nextProps.viewMode) return false;
  if (prevProps.animationDelay !== nextProps.animationDelay) return false;
  if (prevProps.showStatusBadges !== nextProps.showStatusBadges) return false;
  if (prevProps.enablePerformanceMonitoring !== nextProps.enablePerformanceMonitoring) return false;
  
  // onStatusChange comparison (function reference)
  if (prevProps.onStatusChange !== nextProps.onStatusChange) return false;
  
  return true;
};

// Export the memoized component
export const BookmarkCard = memo(BookmarkCardComponent, areBookmarkPropsEqual);