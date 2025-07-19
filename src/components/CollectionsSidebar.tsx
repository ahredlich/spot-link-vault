import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useStaggeredSlideIn } from "@/hooks/useStaggeredAnimation";
import { 
  FolderOpen, 
  Folder, 
  Plus, 
  Settings, 
  Star, 
  Clock, 
  Archive,
  Hash,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  ChevronUp
} from "lucide-react";

interface CollectionsSidebarProps {
  selectedCollection: string;
  onCollectionSelect: (collection: string) => void;
}

// Mock data for collections
const collections = [
  { name: "Web Development", count: 15, icon: FolderOpen },
  { name: "Design", count: 8, icon: Folder },
  { name: "Technology", count: 12, icon: Folder },
  { name: "Research", count: 5, icon: Folder },
];

const quickAccess = [
  { name: "All", count: 40, icon: Archive },
  { name: "Favorites", count: 7, icon: Star },
  { name: "Recent", count: 10, icon: Clock },
  { name: "Unread", count: 3, icon: Hash },
];

export const CollectionsSidebar = ({ selectedCollection, onCollectionSelect }: CollectionsSidebarProps) => {
  const [isCollectionsExpanded, setIsCollectionsExpanded] = useState(true);
  const { user, signOut } = useAuth();

  // Use staggered animations for sidebar items
  const quickAccessAnimation = useStaggeredSlideIn(quickAccess.length, {
    staggerDelay: 60,
    startDelay: 100,
    threshold: 0.1,
  });

  const collectionsAnimation = useStaggeredSlideIn(collections.length + 1, {
    staggerDelay: 80,
    startDelay: 200,
    threshold: 0.1,
  });

  return (
    <div className="w-64 h-full lg:h-screen glass-card-enhanced rounded-none border-r border-white/10 flex flex-col">
      {/* Enhanced Header Section with gradient background */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Subtle background gradient for header */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glass-md">
            <Archive className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground tracking-tight">SpotLink</span>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">VAULT</span>
          </div>
        </div>
        
        {/* Gradient accent line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <ScrollArea className="flex-1 collections-sidebar-scroll">
        <div className="px-6 py-5 space-y-8">
          {/* Quick Access Section with enhanced visual hierarchy */}
          <div className="relative">
            {/* Section background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent rounded-xl pointer-events-none" />
            
            <div className="relative z-10 pb-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  Quick Access
                </h3>
              </div>
              
              <div ref={quickAccessAnimation.containerRef} className="space-y-1">
                {quickAccess.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = selectedCollection === item.name;
                  const itemProps = quickAccessAnimation.getItemProps(index);
                  
                  return (
                    <div
                      key={item.name}
                      {...itemProps}
                      className={itemProps.className}
                      style={itemProps.style}
                    >
                      <Button
                        variant={isSelected ? "glass-primary" : "glass-secondary"}
                        className="w-full justify-between h-10 px-3 transition-glass font-medium"
                        onClick={() => onCollectionSelect(item.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-gradient-glass-tertiary border-white/20 text-xs font-semibold">
                          {item.count}
                        </Badge>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Gradient accent line at bottom of section */}
            <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />
          </div>

          {/* Collections Section with enhanced visual hierarchy */}
          <div className="relative">
            {/* Section background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 to-transparent rounded-xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    Collections
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-white/10 transition-glass"
                  onClick={() => setIsCollectionsExpanded(!isCollectionsExpanded)}
                >
                  {isCollectionsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {isCollectionsExpanded && (
                <div ref={collectionsAnimation.containerRef} className="space-y-1">
                  {collections.map((collection, index) => {
                    const Icon = collection.icon;
                    const isSelected = selectedCollection === collection.name;
                    const itemProps = collectionsAnimation.getItemProps(index);
                    
                    return (
                      <div
                        key={collection.name}
                        {...itemProps}
                        className={itemProps.className}
                        style={itemProps.style}
                      >
                        <Button
                          variant={isSelected ? "glass-primary" : "glass-secondary"}
                          className="w-full justify-between h-10 px-3 transition-glass font-medium"
                          onClick={() => onCollectionSelect(collection.name)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm truncate">{collection.name}</span>
                          </div>
                          <Badge variant="secondary" className="bg-gradient-glass-tertiary border-white/20 text-xs font-semibold">
                            {collection.count}
                          </Badge>
                        </Button>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced spacing for new collection button */}
                  <div className="pt-2">
                    <div
                      {...collectionsAnimation.getItemProps(collections.length)}
                      className={collectionsAnimation.getItemProps(collections.length).className}
                      style={collectionsAnimation.getItemProps(collections.length).style}
                    >
                      <Button
                        variant="glass-secondary"
                        className="w-full justify-start h-10 px-3 text-muted-foreground hover:text-primary transition-glass font-medium border-dashed border-white/30 hover:border-white/50"
                      >
                        <Plus className="h-4 w-4 mr-3" />
                        <span className="text-sm">New Collection</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Enhanced Footer with User Menu */}
      <div className="p-6 border-t border-white/10 relative">
        {/* Subtle background gradient for footer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/20 to-transparent pointer-events-none" />
        
        {/* Gradient accent line at top of footer */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* User Menu with enhanced styling */}
        {user && (
          <div className="relative z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass-secondary" className="w-full justify-between h-12 px-3 transition-glass hover:shadow-glass-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-white text-sm font-semibold">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="text-sm font-semibold text-foreground truncate max-w-full">
                        {user.user_metadata?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-full font-medium">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card-enhanced">
                <DropdownMenuItem className="gap-3 text-foreground hover:bg-white/10 h-10 font-medium">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 text-foreground hover:bg-white/10 h-10 font-medium">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <DropdownMenuItem 
                  className="gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 font-medium"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};