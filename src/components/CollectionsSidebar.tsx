import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Download
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

  return (
    <div className="w-64 h-full lg:h-screen glass-card rounded-none border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Archive className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-foreground">BookmarkApp</span>
        </div>
        
        <Button variant="glass-primary" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          Add Bookmark
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {/* Quick Access */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Quick Access
            </h3>
            {quickAccess.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedCollection === item.name;
              
              return (
                <Button
                  key={item.name}
                  variant={isSelected ? "glass-primary" : "ghost"}
                  className="w-full justify-between h-8 px-2 mb-1"
                  onClick={() => onCollectionSelect(item.name)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 border-white/20 text-xs">
                    {item.count}
                  </Badge>
                </Button>
              );
            })}
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
              <div className="space-y-1">
                {collections.map((collection) => {
                  const Icon = collection.icon;
                  const isSelected = selectedCollection === collection.name;
                  
                  return (
                    <Button
                      key={collection.name}
                      variant={isSelected ? "glass-primary" : "ghost"}
                      className="w-full justify-between h-8 px-2"
                      onClick={() => onCollectionSelect(collection.name)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm truncate">{collection.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/10 border-white/20 text-xs">
                        {collection.count}
                      </Badge>
                    </Button>
                  );
                })}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 px-2 text-muted-foreground hover:text-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm">New Collection</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-2 h-8">
          <Settings className="h-4 w-4" />
          <span className="text-sm">Settings</span>
        </Button>
      </div>
    </div>
  );
};