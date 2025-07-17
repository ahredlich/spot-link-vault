import { ExternalLink, Tag, MoreVertical, Star, Heart, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAnimationPerformance } from "@/hooks/useIntersectionObserver";
import { useState } from "react";

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
  const [localFavorite, setLocalFavorite] = useState(bookmark.isFavorite || false);
  const [localRead, setLocalRead] = useState(bookmark.isRead || false);
  
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
      <div className={`glass-card-enhanced p-3 sm:p-4 group ${shouldAnimate ? 'transition-glass hover:shadow-glass-lg hover:-translate-y-1' : ''}`}>
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Compact thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={bookmark.thumbnail}
                alt={bookmark.title}
                className={`w-12 h-12 sm:w-14 sm:h-14 object-cover ${shouldAnimate ? 'transition-scale group-hover:scale-105' : ''}`}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=56&h=56&fit=crop";
                }}
              />
              {/* Subtle overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 ${shouldAnimate ? 'group-hover:opacity-100 transition-opacity duration-300' : ''}`} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Compact header section */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm sm:text-base text-foreground cursor-pointer line-clamp-1 leading-tight mb-1 ${shouldAnimate ? 'group-hover:text-primary transition-colors duration-200' : ''}`} 
                    onClick={handleOpen}>
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
                  className={`h-7 w-7 shadow-glass-sm ${shouldAnimate ? 'hover:shadow-glass-md hover:scale-105 transition-all duration-200' : ''}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="glass-secondary" 
                      size="icon" 
                      className={`h-7 w-7 shadow-glass-sm ${shouldAnimate ? 'hover:shadow-glass-md hover:scale-105 transition-all duration-200' : ''}`}
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
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-red-600 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 ${shouldAnimate ? 'hover:scale-105 transition-transform duration-200' : ''}`}>
                      <Heart className="w-2.5 h-2.5 fill-current" />
                      <span className="hidden sm:inline">Fav</span>
                    </div>
                  )}
                  {localRead && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 ${shouldAnimate ? 'hover:scale-105 transition-transform duration-200' : ''}`}>
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
                      className={`text-xs px-2 py-0.5 bg-gradient-glass-tertiary border-white/30 font-medium ${shouldAnimate ? 'hover:bg-gradient-glass-secondary hover:scale-105 hover:shadow-glass-sm transition-all duration-200 cursor-pointer' : ''}`}
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
        shouldAnimate ? 'animate-fade-in-up transition-glass hover:scale-[1.02] hover:-translate-y-2 hover:shadow-glass-xl' : ''
      }`}
      style={animationStyle}
    >
      {/* Enhanced image section with improved gradient overlay */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title}
          className={`w-full h-full object-cover ${
            shouldAnimate ? 'group-hover:scale-110 transition-transform duration-500 ease-out' : ''
          }`}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=200&fit=crop";
          }}
        />
        
        {/* Enhanced gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 ${
          shouldAnimate ? 'group-hover:opacity-100 transition-opacity duration-300' : ''
        }`} />
        
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
        <div className={`absolute top-2 right-2 transition-opacity duration-300 ease-out ${
          shouldAnimate ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="glass-card-tertiary p-2 rounded-lg shadow-glass-sm hover:shadow-glass-md transition-all duration-200 cursor-pointer hover:scale-105">
                <MoreVertical className="h-4 w-4 text-foreground/70 hover:text-foreground" />
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
          <h3 className={`font-semibold text-base text-foreground cursor-pointer line-clamp-2 flex-1 ${
            shouldAnimate ? 'group-hover:text-primary transition-colors duration-200' : ''
          }`} 
              onClick={handleOpen}>
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
                className={`text-xs bg-gradient-glass-tertiary border-white/20 ${
                  shouldAnimate ? 'hover:bg-gradient-glass-secondary hover:scale-105 transition-all duration-200' : ''
                }`}
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