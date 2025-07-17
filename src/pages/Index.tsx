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
  },
  {
    id: "5",
    title: "TypeScript Best Practices 2024",
    description: "Essential TypeScript patterns and practices for modern web development",
    url: "https://typescript-guide.dev",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    tags: ["typescript", "javascript", "webdev", "best-practices"],
    collection: "Web Development",
    createdAt: new Date("2024-01-11"),
    favicon: "https://typescript-guide.dev/favicon.ico",
    isFavorite: true,
    isRead: false,
    readingTime: 10,
    domain: "typescript-guide.dev"
  },
  {
    id: "6",
    title: "Quantum Computing Breakthroughs",
    description: "Recent advances in quantum computing and their practical applications",
    url: "https://quantum-news.com/breakthroughs",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    tags: ["quantum", "computing", "science", "innovation"],
    collection: "Technology",
    createdAt: new Date("2024-01-10"),
    favicon: "https://quantum-news.com/favicon.ico",
    isFavorite: false,
    isRead: true,
    readingTime: 18,
    domain: "quantum-news.com"
  },
  {
    id: "7",
    title: "Color Theory for Digital Design",
    description: "Complete guide to understanding and applying color theory in digital interfaces",
    url: "https://colortheory.design",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=200&fit=crop",
    tags: ["color", "design", "ui", "theory"],
    collection: "Design",
    createdAt: new Date("2024-01-09"),
    favicon: "https://colortheory.design/favicon.ico",
    isFavorite: true,
    isRead: true,
    readingTime: 7,
    domain: "colortheory.design"
  },
  {
    id: "8",
    title: "Node.js Microservices Architecture",
    description: "Building scalable microservices with Node.js and Docker containers",
    url: "https://microservices.nodejs.org",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
    tags: ["nodejs", "microservices", "docker", "backend"],
    collection: "Web Development",
    createdAt: new Date("2024-01-08"),
    favicon: "https://microservices.nodejs.org/favicon.ico",
    isFavorite: false,
    isRead: false,
    readingTime: 22,
    domain: "microservices.nodejs.org"
  },
  {
    id: "9",
    title: "Cybersecurity Trends 2024",
    description: "Emerging cybersecurity threats and defense strategies for the modern enterprise",
    url: "https://cybersec-trends.com/2024",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
    tags: ["cybersecurity", "security", "trends", "enterprise"],
    collection: "Technology",
    createdAt: new Date("2024-01-07"),
    favicon: "https://cybersec-trends.com/favicon.ico",
    isFavorite: true,
    isRead: false,
    readingTime: 14,
    domain: "cybersec-trends.com"
  },
  {
    id: "10",
    title: "User Research Methods Guide",
    description: "Comprehensive guide to conducting effective user research for product design",
    url: "https://userresearch.guide",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    tags: ["user-research", "ux", "methodology", "product"],
    collection: "Research",
    createdAt: new Date("2024-01-06"),
    favicon: "https://userresearch.guide/favicon.ico",
    isFavorite: false,
    isRead: true,
    readingTime: 16,
    domain: "userresearch.guide"
  },
  {
    id: "11",
    title: "CSS Animation Techniques",
    description: "Advanced CSS animation techniques for creating smooth, performant web animations",
    url: "https://css-animations.dev",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
    tags: ["css", "animation", "performance", "webdev"],
    collection: "Web Development",
    createdAt: new Date("2024-01-05"),
    favicon: "https://css-animations.dev/favicon.ico",
    isFavorite: true,
    isRead: true,
    readingTime: 9,
    domain: "css-animations.dev"
  },
  {
    id: "12",
    title: "Blockchain in Healthcare",
    description: "Exploring blockchain applications in healthcare data management and patient privacy",
    url: "https://blockchain-health.org",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
    tags: ["blockchain", "healthcare", "privacy", "innovation"],
    collection: "Technology",
    createdAt: new Date("2024-01-04"),
    favicon: "https://blockchain-health.org/favicon.ico",
    isFavorite: false,
    isRead: false,
    readingTime: 20,
    domain: "blockchain-health.org"
  },
  {
    id: "13",
    title: "Typography in Web Design",
    description: "Essential typography principles for creating readable and beautiful web content",
    url: "https://web-typography.com",
    thumbnail: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=400&h=200&fit=crop",
    tags: ["typography", "design", "fonts", "readability"],
    collection: "Design",
    createdAt: new Date("2024-01-03"),
    favicon: "https://web-typography.com/favicon.ico",
    isFavorite: true,
    isRead: false,
    readingTime: 11,
    domain: "web-typography.com"
  },
  {
    id: "14",
    title: "GraphQL vs REST APIs",
    description: "Comprehensive comparison of GraphQL and REST API architectures with real examples",
    url: "https://api-comparison.dev",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
    tags: ["graphql", "rest", "api", "backend", "comparison"],
    collection: "Web Development",
    createdAt: new Date("2024-01-02"),
    favicon: "https://api-comparison.dev/favicon.ico",
    isFavorite: false,
    isRead: true,
    readingTime: 13,
    domain: "api-comparison.dev"
  },
  {
    id: "15",
    title: "Climate Tech Innovations",
    description: "Latest technological innovations addressing climate change and sustainability challenges",
    url: "https://climate-tech.org/innovations",
    thumbnail: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=200&fit=crop",
    tags: ["climate", "sustainability", "green-tech", "innovation"],
    collection: "Technology",
    createdAt: new Date("2024-01-01"),
    favicon: "https://climate-tech.org/favicon.ico",
    isFavorite: true,
    isRead: true,
    readingTime: 17,
    domain: "climate-tech.org"
  },
  {
    id: "16",
    title: "A/B Testing Best Practices",
    description: "Statistical methods and practical guidelines for effective A/B testing in product development",
    url: "https://abtesting.guide",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    tags: ["ab-testing", "statistics", "product", "optimization"],
    collection: "Research",
    createdAt: new Date("2023-12-31"),
    favicon: "https://abtesting.guide/favicon.ico",
    isFavorite: false,
    isRead: false,
    readingTime: 19,
    domain: "abtesting.guide"
  },
  {
    id: "17",
    title: "Vue.js 3 Composition API",
    description: "Deep dive into Vue.js 3 Composition API with practical examples and best practices",
    url: "https://vue3-guide.dev",
    thumbnail: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=400&h=200&fit=crop",
    tags: ["vue", "javascript", "composition-api", "frontend"],
    collection: "Web Development",
    createdAt: new Date("2023-12-30"),
    favicon: "https://vue3-guide.dev/favicon.ico",
    isFavorite: true,
    isRead: false,
    readingTime: 12,
    domain: "vue3-guide.dev"
  },
  {
    id: "18",
    title: "Edge Computing Revolution",
    description: "How edge computing is transforming data processing and reducing latency worldwide",
    url: "https://edge-computing.tech",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
    tags: ["edge-computing", "cloud", "latency", "infrastructure"],
    collection: "Technology",
    createdAt: new Date("2023-12-29"),
    favicon: "https://edge-computing.tech/favicon.ico",
    isFavorite: false,
    isRead: true,
    readingTime: 15,
    domain: "edge-computing.tech"
  },
  {
    id: "19",
    title: "Design System Components",
    description: "Building consistent and scalable design systems with reusable component libraries",
    url: "https://design-systems.io",
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop",
    tags: ["design-system", "components", "ui", "consistency"],
    collection: "Design",
    createdAt: new Date("2023-12-28"),
    favicon: "https://design-systems.io/favicon.ico",
    isFavorite: true,
    isRead: true,
    readingTime: 8,
    domain: "design-systems.io"
  },
  {
    id: "20",
    title: "Mobile App Security",
    description: "Essential security practices for developing secure mobile applications across platforms",
    url: "https://mobile-security.dev",
    thumbnail: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&h=200&fit=crop",
    tags: ["mobile", "security", "app-development", "best-practices"],
    collection: "Technology",
    createdAt: new Date("2023-12-27"),
    favicon: "https://mobile-security.dev/favicon.ico",
    isFavorite: false,
    isRead: false,
    readingTime: 14,
    domain: "mobile-security.dev"
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
      {/* Desktop Sidebar - Fixed Position */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-30">
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

      {/* Main Content - Account for Fixed Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
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
              <div className="relative flex-1 max-w-xs sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 search-glass-glow text-sm"
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