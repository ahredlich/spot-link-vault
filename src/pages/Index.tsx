import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Grid, List, Bookmark, Tag, Calendar, ExternalLink, Upload, Menu, Star, Shield, Zap, Download, Heart, BookOpen, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { CollectionsSidebar } from "@/components/CollectionsSidebar";
import { BookmarkCardSkeleton, SidebarSkeleton } from "@/components/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useStaggeredAnimation, useStaggeredFadeIn } from "@/hooks/useStaggeredAnimation";

// Mock data for demonstration with enhanced properties
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
    favicon: "https://cssgrid.io/favicon.ico",
    isFavorite: true,
    isRead: false,
    readingTime: 8,
    domain: "cssgrid.io"
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
    favicon: "https://example.com/favicon.ico",
    isFavorite: false,
    isRead: true,
    readingTime: 12,
    domain: "example.com"
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
    favicon: "https://design-principles.com/favicon.ico",
    isFavorite: true,
    isRead: true,
    readingTime: 6,
    domain: "design-principles.com"
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
    favicon: "https://react-perf.dev/favicon.ico",
    isFavorite: false,
    isRead: false,
    readingTime: 15,
    domain: "react-perf.dev"
  }
];

// Landing Page Component for non-authenticated users
const LandingPage = () => {
  // Use staggered animations for landing page sections
  const previewCardsAnimation = useStaggeredFadeIn(3, {
    staggerDelay: 150,
    startDelay: 200,
    threshold: 0.2,
  });

  const featuresAnimation = useStaggeredAnimation(4, {
    type: "scale-in",
    staggerDelay: 120,
    startDelay: 100,
    threshold: 0.15,
  });

  return (
    <div className="min-h-screen w-full bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SpotLink Vault
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="glass-secondary" className="text-foreground hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="glass-primary" className="gap-2">
                Sign In
                <Sparkles className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Star className="h-4 w-4" />
              Your Ultimate Bookmark Management Solution
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Organize Your Digital World
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Save, organize, and access your favorite links from anywhere. 
            Build collections, tag content, and never lose track of important resources again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/auth">
              <Button size="lg" variant="glass-primary" className="gap-2 px-8 py-6 text-lg">
                Start Organizing
                <Zap className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Preview Cards */}
          <div 
            ref={previewCardsAnimation.containerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Bookmark,
                title: "Smart Collections",
                description: "Organize bookmarks into intelligent collections with custom tags and categories.",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Search,
                title: "Instant Search", 
                description: "Find any bookmark instantly with powerful search across titles, descriptions, and tags.",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your bookmarks are encrypted and stored securely with enterprise-grade protection.",
                gradient: "from-emerald-500 to-emerald-600"
              }
            ].map((feature, index) => {
              const itemProps = previewCardsAnimation.getItemProps(index);
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  {...itemProps}
                  className={`glass-card p-6 text-left transition-glass ${itemProps.className}`}
                  style={itemProps.style}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-glass-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make bookmark management effortless and efficient.
          </p>
        </div>
        
        <div 
          ref={featuresAnimation.containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Download,
              title: "Import & Export",
              description: "Seamlessly import from browsers or export your data anytime.",
              gradient: "from-orange-500 to-red-500"
            },
            {
              icon: Tag,
              title: "Smart Tagging",
              description: "Auto-categorize and tag your bookmarks intelligently.",
              gradient: "from-cyan-500 to-blue-500"
            },
            {
              icon: Heart,
              title: "Favorites",
              description: "Mark important bookmarks and access them quickly.",
              gradient: "from-pink-500 to-purple-500"
            },
            {
              icon: Users,
              title: "Team Sharing",
              description: "Share collections with your team and collaborate efficiently.",
              gradient: "from-green-500 to-emerald-500"
            }
          ].map((feature, index) => {
            const itemProps = featuresAnimation.getItemProps(index);
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.title}
                {...itemProps}
                className={`glass-card p-6 text-center transition-scale ${itemProps.className}`}
                style={itemProps.style}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 shadow-glass-xl`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="glass-card p-12 max-w-3xl mx-auto bg-gradient-accent">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to Get Organized?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who have transformed their digital workflow with SpotLink Vault.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="glass-primary" className="gap-2 px-8 py-6 text-lg focus-ring-enhanced">
              Create Your Account
              <Sparkles className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">SpotLink Vault</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 SpotLink Vault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Main Bookmark Manager Component for authenticated users
const BookmarkManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle bookmark status changes
  const handleBookmarkStatusChange = (id: string, status: 'favorite' | 'read', value: boolean) => {
    console.log(`Bookmark ${id} ${status} changed to:`, value);
    // In a real app, this would update the backend/state management
    // For now, we'll just log the change
  };

  const filteredBookmarks = mockBookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCollection = selectedCollection === "All" || bookmark.collection === selectedCollection;
    
    return matchesSearch && matchesCollection;
  });

  // Use staggered animation for bookmark cards
  const bookmarkAnimation = useStaggeredAnimation(filteredBookmarks.length, {
    type: viewMode === "grid" ? "scale-in" : "slide-in",
    staggerDelay: 80,
    startDelay: 100,
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <div className="min-h-screen w-full flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CollectionsSidebar 
          selectedCollection={selectedCollection}
          onCollectionSelect={setSelectedCollection}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <CollectionsSidebar 
            selectedCollection={selectedCollection}
            onCollectionSelect={(collection) => {
              setSelectedCollection(collection);
              setIsMobileSidebarOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 glass-card-secondary border-b border-white/10">
          <div className="flex items-center justify-between p-3 sm:p-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="glass-secondary" size="icon" className="lg:hidden h-8 w-8">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bookmarks
              </h1>
              
              {/* Search */}
              <div className="relative flex-1 max-w-xs sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 search-glass-enhanced text-sm focus-ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* View Toggle */}
              <div className="flex items-center rounded-lg p-1 backdrop-blur-xl bg-gradient-to-r from-white/20 to-white/10 border border-white/30 shadow-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-7 w-7 sm:h-8 sm:w-8 p-0 transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105" 
                      : "hover:bg-white/20 text-foreground/70"
                  }`}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-7 w-7 sm:h-8 sm:w-8 p-0 transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105" 
                      : "hover:bg-white/20 text-foreground/70"
                  }`}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {/* Add Bookmark */}
              <Button
                variant="default"
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 px-2 sm:px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add Bookmark</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-6 w-full">
          {isLoading ? (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                : "space-y-3 sm:space-y-4"
            }>
              {Array.from({ length: 8 }).map((_, i) => (
                <BookmarkCardSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="glass-card p-6 sm:p-8 text-center max-w-md mx-auto">
                <Bookmark className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No bookmarks found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start by adding your first bookmark"}
                </p>
                <Button variant="glass-primary" onClick={() => setIsAddDialogOpen(true)} className="text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Bookmark
                </Button>
              </div>
            </div>
          ) : (
            <div 
              ref={bookmarkAnimation.containerRef}
              className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                  : "space-y-3 sm:space-y-4"
              }
            >
              {filteredBookmarks.map((bookmark, index) => {
                const itemProps = bookmarkAnimation.getItemProps(index);
                return (
                  <div
                    key={bookmark.id}
                    {...itemProps}
                    className={`transition-glass ${itemProps.className}`}
                    style={itemProps.style}
                  >
                    <BookmarkCard
                      bookmark={bookmark}
                      viewMode={viewMode}
                      animationDelay={index * 80}
                      showStatusBadges={true}
                      onStatusChange={handleBookmarkStatusChange}
                    />
                  </div>
                );
              })}
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

// Main Index Component
const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-subtle">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated, bookmark manager if authenticated
  return user ? <BookmarkManager /> : <LandingPage />;
};

export default Index;