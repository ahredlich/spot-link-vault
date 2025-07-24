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
                        className={`
                          w-full justify-between h-11 px-4 py-2.5 transition-glass font-medium
                          ${isSelected 
                            ? 'bg-gradient-to-r from-primary/15 to-accent/15 border-primary/25 text-primary shadow-glass-md hover:from-primary/20 hover:to-accent/20 hover:shadow-glass-lg hover:scale-[1.01] hover:-translate-y-0.5' 
                            : 'hover:bg-gradient-to-r hover:from-white/12 hover:to-white/8 hover:border-white/25 hover:shadow-glass-md hover:scale-[1.005] hover:-translate-y-0.5'
                          }
                          group relative overflow-hidden
                        `}
                        onClick={() => onCollectionSelect(item.name)}
                      >
                        {/* Enhanced gradient overlay for selected state */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50 transition-opacity duration-300 group-hover:opacity-70" />
                        )}
                        
                        <div className="flex items-center gap-3.5 relative z-10 min-w-0 flex-1">
                          <div className={`
                            p-1.5 rounded-lg transition-all duration-300 flex-shrink-0
                            ${isSelected 
                              ? 'bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm' 
                              : 'bg-white/10 group-hover:bg-white/15 group-hover:shadow-sm'
                            }
                          `}>
                            <Icon className={`
                              h-4 w-4 transition-all duration-300
                              ${isSelected 
                                ? 'text-primary drop-shadow-sm' 
                                : 'text-foreground/70 group-hover:text-foreground group-hover:scale-105'
                              }
                            `} />
                          </div>
                          <span className={`
                            text-sm transition-all duration-300 font-medium flex-1 min-w-0 text-left
                            ${isSelected 
                              ? 'text-primary font-semibold' 
                              : 'text-foreground/80 group-hover:text-foreground'
                            }
                          `}>
                            <span className="truncate block text-left">
                              {item.name}
                            </span>
                          </span>
                        </div>
                        
                        {/* Enhanced collection count badge */}
                        <div className="relative z-10">
                          <Badge 
                            variant="secondary" 
                            className={`
                              text-xs font-bold transition-all duration-300 border
                              ${isSelected 
                                ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 text-primary shadow-sm' 
                                : 'bg-gradient-to-r from-white/15 to-white/10 border-white/25 text-foreground/70 group-hover:from-white/20 group-hover:to-white/15 group-hover:border-white/35 group-hover:text-foreground group-hover:shadow-sm'
                              }
                              px-2.5 py-0.5 min-w-[2rem] justify-center
                            `}
                          >
                            {item.count}
                          </Badge>
                        </div>
                        
                        {/* Subtle shimmer effect on hover for non-selected items */}
                        {!isSelected && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                          </div>
                        )}
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
                          className={`
                            w-full justify-between h-11 px-4 py-2.5 transition-glass font-medium
                            ${isSelected 
                              ? 'bg-gradient-to-r from-primary/15 to-accent/15 border-primary/25 text-primary shadow-glass-md hover:from-primary/20 hover:to-accent/20 hover:shadow-glass-lg hover:scale-[1.01] hover:-translate-y-0.5' 
                              : 'hover:bg-gradient-to-r hover:from-white/12 hover:to-white/8 hover:border-white/25 hover:shadow-glass-md hover:scale-[1.005] hover:-translate-y-0.5'
                            }
                            group relative overflow-hidden
                          `}
                          onClick={() => onCollectionSelect(collection.name)}
                        >
                          {/* Enhanced gradient overlay for selected state */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50 transition-opacity duration-300 group-hover:opacity-70" />
                          )}
                          
                          <div className="flex items-center gap-3.5 relative z-10 min-w-0 flex-1">
                            <div className={`
                              p-1.5 rounded-lg transition-all duration-300 flex-shrink-0
                              ${isSelected 
                                ? 'bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm' 
                                : 'bg-white/10 group-hover:bg-white/15 group-hover:shadow-sm'
                              }
                            `}>
                              <Icon className={`
                                h-4 w-4 transition-all duration-300
                                ${isSelected 
                                  ? 'text-primary drop-shadow-sm' 
                                  : 'text-foreground/70 group-hover:text-foreground group-hover:scale-105'
                                }
                              `} />
                            </div>
                            <span className={`
                              text-sm transition-all duration-300 font-medium flex-1 min-w-0 text-left
                              ${isSelected 
                                ? 'text-primary font-semibold' 
                                : 'text-foreground/80 group-hover:text-foreground'
                              }
                            `}>
                              <span className="truncate block text-left">
                                {collection.name}
                              </span>
                            </span>
                          </div>
                          
                          {/* Enhanced collection count badge */}
                          <div className="relative z-10">
                            <Badge 
                              variant="secondary" 
                              className={`
                                text-xs font-bold transition-all duration-300 border
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 text-primary shadow-sm' 
                                  : 'bg-gradient-to-r from-white/15 to-white/10 border-white/25 text-foreground/70 group-hover:from-white/20 group-hover:to-white/15 group-hover:border-white/35 group-hover:text-foreground group-hover:shadow-sm'
                                }
                                px-2.5 py-0.5 min-w-[2rem] justify-center
                              `}
                            >
                              {collection.count}
                            </Badge>
                          </div>
                          
                          {/* Subtle shimmer effect on hover for non-selected items */}
                          {!isSelected && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                            </div>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced spacing for new collection button */}
                  <div className="pt-3">
                    <div
                      {...collectionsAnimation.getItemProps(collections.length)}
                      className={collectionsAnimation.getItemProps(collections.length).className}
                      style={collectionsAnimation.getItemProps(collections.length).style}
                    >
                      <Button
                        variant="glass-secondary"
                        className="
                          w-full justify-start h-11 px-4 py-2.5 text-muted-foreground hover:text-primary 
                          transition-glass font-medium border-dashed border-white/30 hover:border-primary/40
                          hover:bg-gradient-to-r hover:from-primary/8 hover:to-accent/8 hover:shadow-glass-sm
                          hover:scale-[1.005] hover:-translate-y-0.5 group relative overflow-hidden
                        "
                      >
                        <div className="flex items-center gap-3.5 relative z-10 min-w-0 flex-1">
                          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-primary/15 group-hover:shadow-sm transition-all duration-300 flex-shrink-0">
                            <Plus className="h-4 w-4 transition-all duration-300 group-hover:scale-105" />
                          </div>
                          <span className="text-sm font-medium transition-all duration-300 flex-1 min-w-0 text-left">
                            <span className="truncate block text-left">New Collection</span>
                          </span>
                        </div>
                        
                        {/* Subtle shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Enhanced Footer with User Profile Section */}
      <div className="p-6 border-t border-white/10 relative">
        {/* Enhanced background gradient for footer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/30 via-blue-50/10 to-transparent pointer-events-none" />
        
        {/* Enhanced gradient accent line at top of footer */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* Enhanced User Profile Section */}
        {user && (
          <div className="relative z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="glass-secondary" 
                  className="w-full justify-between items-center h-14 px-4 py-3 transition-glass hover:shadow-glass-lg hover:scale-[1.01] hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Enhanced Avatar with Status Indicator */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-glass-sm transition-all duration-300 group-hover:ring-white/50 group-hover:shadow-glass-md">
                        <AvatarImage 
                          src={user.user_metadata?.avatar_url} 
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold shadow-inner">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online Status Indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm transition-all duration-300 group-hover:scale-110">
                        <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Enhanced User Information Layout */}
                    <div className="flex flex-col justify-center min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground truncate tracking-tight transition-colors duration-300 group-hover:text-primary text-left">
                          {user.user_metadata?.full_name || 'User'}
                        </span>
                        {/* User Status Badge - moved inline */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-600 font-medium tracking-wide whitespace-nowrap">
                            Online
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground truncate font-medium tracking-wide transition-colors duration-300 group-hover:text-foreground/70 text-left">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Chevron with Animation */}
                  <div className="flex items-center justify-center flex-shrink-0 ml-2">
                    <ChevronUp className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 group-data-[state=open]:rotate-180" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              {/* Enhanced Dropdown Menu with Glass Morphism */}
              <DropdownMenuContent 
                align="end" 
                className="w-64 glass-card-enhanced border-white/20 shadow-glass-xl backdrop-blur-xl"
                sideOffset={8}
              >
                {/* User Info Header in Dropdown */}
                <div className="px-3 py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-white/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-white text-xs font-bold">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold text-foreground truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate font-medium">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Menu Items */}
                <div className="p-1">
                  <DropdownMenuItem className="gap-3 text-foreground hover:bg-white/15 hover:backdrop-blur-sm h-11 font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-glass-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 text-foreground hover:bg-white/15 hover:backdrop-blur-sm h-11 font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-glass-sm">
                    <Settings className="h-4 w-4 text-primary" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                </div>
                
                {/* Enhanced Separator */}
                <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/25 to-transparent my-2" />
                
                {/* Sign Out Item */}
                <div className="p-1">
                  <DropdownMenuItem 
                    className="gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/15 hover:backdrop-blur-sm h-11 font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-glass-sm"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};