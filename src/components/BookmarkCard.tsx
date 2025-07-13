import { ExternalLink, Tag, MoreVertical, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: "grid" | "list";
}

export const BookmarkCard = ({ bookmark, viewMode }: BookmarkCardProps) => {
  const handleOpen = () => {
    window.open(bookmark.url, "_blank");
  };

  if (viewMode === "list") {
    return (
      <div className="glass-card p-3 sm:p-4 group hover:scale-[1.01] transition-transform">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              src={bookmark.thumbnail}
              alt={bookmark.title}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=64&h=64&fit=crop";
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2" 
                    onClick={handleOpen}>
                  {bookmark.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                  {bookmark.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <img src={bookmark.favicon} alt="" className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-muted-foreground truncate flex-1">{bookmark.url}</span>
                  <span className="text-muted-foreground hidden sm:inline">
                    {bookmark.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleOpen} className="h-7 w-7 sm:h-8 sm:w-8">
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card border-white/20">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Move to Collection</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bookmark.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-white/10 border-white/20">
                    {tag}
                  </Badge>
                ))}
                {bookmark.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-white/10 border-white/20">
                    +{bookmark.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card group overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=200&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="glass" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/20">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Move to Collection</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2 flex-1" 
              onClick={handleOpen}>
            {bookmark.title}
          </h3>
          <Button variant="ghost" size="icon" onClick={handleOpen} className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 ml-2">
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
          {bookmark.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <img src={bookmark.favicon} alt="" className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="truncate flex-1">{bookmark.url}</span>
        </div>
        
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-white/10 border-white/20">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-white/10 border-white/20">
                +{bookmark.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate flex-1">{bookmark.collection}</span>
          <span className="hidden sm:inline">{bookmark.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};