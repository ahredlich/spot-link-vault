import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Grid, List, Bookmark, Tag, Calendar, ExternalLink, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { CollectionsSidebar } from "@/components/CollectionsSidebar";

// Mock data for demonstration
const mockBookmarks = [
  {
    id: "1",
    title: "Beautiful CSS Grid Examples",
    description: "A collection of stunning CSS Grid layouts and examples for modern web design",
    url: "https://cssgrid.io",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    tags: ["css", "grid", "webdev"],
    collection: "Web Development",
    createdAt: new Date("2024-01-15"),
    favicon: "https://cssgrid.io/favicon.ico"
  },
  {
    id: "2", 
    title: "The Future of AI and Machine Learning",
    description: "Exploring the latest developments in artificial intelligence and their impact on society",
    url: "https://example.com/ai-future",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    tags: ["ai", "technology", "future"],
    collection: "Technology",
    createdAt: new Date("2024-01-14"),
    favicon: "https://example.com/favicon.ico"
  },
  {
    id: "3",
    title: "Minimalist Design Principles",
    description: "Understanding the core principles of minimalist design for better user experiences",
    url: "https://design-principles.com",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop",
    tags: ["design", "minimalism", "ux"],
    collection: "Design",
    createdAt: new Date("2024-01-13"),
    favicon: "https://design-principles.com/favicon.ico"
  },
  {
    id: "4",
    title: "React Performance Optimization",
    description: "Advanced techniques for optimizing React applications for better performance",
    url: "https://react-perf.dev",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    tags: ["react", "performance", "optimization"],
    collection: "Web Development", 
    createdAt: new Date("2024-01-12"),
    favicon: "https://react-perf.dev/favicon.ico"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredBookmarks = mockBookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCollection = selectedCollection === "All" || bookmark.collection === selectedCollection;
    
    return matchesSearch && matchesCollection;
  });

  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar */}
      <CollectionsSidebar 
        selectedCollection={selectedCollection}
        onCollectionSelect={setSelectedCollection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-lg border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bookmarks
              </h1>
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 search-glass border-white/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20">
                <Button
                  variant={viewMode === "grid" ? "glass-primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "glass-primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Add Bookmark */}
              <Button
                variant="glass-primary"
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Bookmark
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="glass-card p-8 text-center max-w-md">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start by adding your first bookmark"}
                </p>
                <Button variant="glass-primary" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Bookmark
                </Button>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }>
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Bookmark Dialog */}
      <AddBookmarkDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Index;