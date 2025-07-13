import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-white/10 bg-background/80 backdrop-blur-xl" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-white/10">
        {isCollapsed ? (
          <div className="flex justify-center">
            <SidebarTrigger className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Archive className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">BookmarkApp</span>
            </div>
            <SidebarTrigger className="h-6 w-6 ml-auto">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        )}
        
        {!isCollapsed && (
          <Button variant="glass-primary" className="w-full justify-start gap-2 mt-4">
            <Plus className="h-4 w-4" />
            Add Bookmark
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Access */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Access
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {quickAccess.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCollection === item.name;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      onClick={() => onCollectionSelect(item.name)}
                      isActive={isSelected}
                      className="h-8"
                      tooltip={isCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm">{item.name}</span>
                          <Badge variant="secondary" className="bg-white/10 border-white/20 text-xs ml-auto">
                            {item.count}
                          </Badge>
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collections */}
        <SidebarGroup>
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2">
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Collections
              </SidebarGroupLabel>
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
          )}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {(isCollapsed || isCollectionsExpanded) && collections.map((collection) => {
                const Icon = collection.icon;
                const isSelected = selectedCollection === collection.name;
                
                return (
                  <SidebarMenuItem key={collection.name}>
                    <SidebarMenuButton
                      onClick={() => onCollectionSelect(collection.name)}
                      isActive={isSelected}
                      className="h-8"
                      tooltip={isCollapsed ? collection.name : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm truncate">{collection.name}</span>
                          <Badge variant="secondary" className="bg-white/10 border-white/20 text-xs ml-auto">
                            {collection.count}
                          </Badge>
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {!isCollapsed && (isCollectionsExpanded || isCollapsed) && (
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-8 text-muted-foreground hover:text-primary">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">New Collection</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-8" tooltip={isCollapsed ? "Import & Export" : undefined}>
              <Link to="/import-export" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {!isCollapsed && <span className="text-sm">Import & Export</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8" tooltip={isCollapsed ? "Settings" : undefined}>
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span className="text-sm">Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};