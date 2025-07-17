import { BookmarkCard } from "./BookmarkCard";

// Test data with enhanced properties
const testBookmarks = [
  {
    id: "1",
    title: "Advanced React Patterns and Best Practices",
    description: "Learn about advanced React patterns including render props, higher-order components, and custom hooks for building scalable applications.",
    url: "https://example.com/react-patterns",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    tags: ["React", "JavaScript", "Frontend", "Patterns"],
    collection: "Development",
    createdAt: new Date("2024-01-15"),
    favicon: "https://example.com/favicon.ico",
    isFavorite: true,
    isRead: false,
    readingTime: 12,
    domain: "example.com"
  },
  {
    id: "2", 
    title: "CSS Grid Layout Complete Guide",
    description: "A comprehensive guide to CSS Grid Layout with practical examples and real-world use cases.",
    url: "https://css-tricks.com/grid-guide",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    tags: ["CSS", "Grid", "Layout"],
    collection: "Design",
    createdAt: new Date("2024-01-10"),
    favicon: "https://css-tricks.com/favicon.ico",
    isFavorite: false,
    isRead: true,
    readingTime: 8,
    domain: "css-tricks.com"
  },
  {
    id: "3",
    title: "TypeScript Advanced Types",
    description: "Deep dive into TypeScript's advanced type system including conditional types, mapped types, and template literal types.",
    url: "https://typescript.org/advanced-types",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    tags: ["TypeScript", "Types", "Programming"],
    collection: "Development",
    createdAt: new Date("2024-01-05"),
    favicon: "https://typescript.org/favicon.ico",
    isFavorite: true,
    isRead: true,
    readingTime: 15,
    domain: "typescript.org"
  }
];

export const BookmarkCardTest = () => {
  const handleStatusChange = (id: string, status: 'favorite' | 'read', value: boolean) => {
    console.log(`Bookmark ${id} ${status} changed to:`, value);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Enhanced BookmarkCard Test</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Grid View with Staggered Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testBookmarks.map((bookmark, index) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                viewMode="grid"
                animationDelay={index * 150}
                showStatusBadges={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">List View</h2>
          <div className="space-y-4">
            {testBookmarks.map((bookmark, index) => (
              <BookmarkCard
                key={`list-${bookmark.id}`}
                bookmark={bookmark}
                viewMode="list"
                animationDelay={index * 100}
                showStatusBadges={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};