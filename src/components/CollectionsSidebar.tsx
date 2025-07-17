import { useState } from "react";
import { Link } from "react-router-dom";
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
  Upload,
  Download,
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
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glass-sm">
            <Archive className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-foreground">SpotLink Vault</span>
        </div>
        
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {/* Quick Access */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Quick Access
            </h3>
            <div ref={quickAccessAnimation.containerRef}>
              {quickAccess.map((item, index) => {
                const Icon = item.icon;
                const isSelected = selectedCollection === item.name;
                const itemProps = quickAccessAnimation.getItemProps(index);
                
                return (
                  <div
                    key={item.name}
                    {...itemProps}
                    className={`mb-1 ${itemProps.className}`}
                    style={itemProps.style}
                  >
                    <Button
                      variant={isSelected ? "glass-primary" : "glass-secondary"}
                      className="w-full justify-between h-8 px-2 transition-glass"
                      onClick={() => onCollectionSelect(item.name)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-glass-tertiary border-white/20 text-xs">
                        {item.count}
                      </Badge>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                Collections
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsCollectionsExpanded(!isCollectionsExpanded)}
              >
                {isCollectionsExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
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
                        className="w-full justify-between h-8 px-2 transition-glass"
                        onClick={() => onCollectionSelect(collection.name)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm truncate">{collection.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-gradient-glass-tertiary border-white/20 text-xs">
                          {collection.count}
                        </Badge>
                      </Button>
                    </div>
                  );
                })}
                
                <div
                  {...collectionsAnimation.getItemProps(collections.length)}
                  className={collectionsAnimation.getItemProps(collections.length).className}
                  style={collectionsAnimation.getItemProps(collections.length).style}
                >
                  <Button
                    variant="glass-secondary"
                    className="w-full justify-start h-8 px-2 text-muted-foreground hover:text-primary transition-glass"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-sm">New Collection</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer with User Menu */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="glass-secondary" className="w-full justify-between h-10 px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-primary text-white text-xs">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                      {user.user_metadata?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <ChevronUp className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card-enhanced">
              <DropdownMenuItem className="gap-2 text-foreground hover:bg-white/10">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-foreground hover:bg-white/10">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem 
                className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};