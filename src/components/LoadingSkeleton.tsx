import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "title" | "avatar" | "button";
}

export const LoadingSkeleton = ({ className, variant = "text" }: LoadingSkeletonProps) => {
  const baseClasses = "loading-skeleton animate-pulse";
  
  const variantClasses = {
    card: "h-48 w-full rounded-lg",
    text: "h-4 w-full rounded",
    title: "h-6 w-3/4 rounded",
    avatar: "h-8 w-8 rounded-full",
    button: "h-10 w-24 rounded-md"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  );
};

interface BookmarkCardSkeletonProps {
  viewMode: "grid" | "list";
}

export const BookmarkCardSkeleton = ({ viewMode }: BookmarkCardSkeletonProps) => {
  if (viewMode === "list") {
    return (
      <div className="glass-card-tertiary p-3 sm:p-4 shimmer-effect">
        <div className="flex items-start gap-3 sm:gap-4">
          <LoadingSkeleton variant="card" className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="title" />
            <LoadingSkeleton variant="text" className="w-5/6" />
            <LoadingSkeleton variant="text" className="w-4/6" />
            <div className="flex gap-2 mt-3">
              <LoadingSkeleton className="h-5 w-12 rounded-full" />
              <LoadingSkeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-tertiary overflow-hidden shimmer-effect">
      <LoadingSkeleton variant="card" className="aspect-video" />
      <div className="p-3 sm:p-4 space-y-3">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" className="w-4/5" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-5 w-12 rounded-full" />
          <LoadingSkeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="w-64 h-full glass-card-tertiary rounded-none border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <LoadingSkeleton className="w-8 h-8 rounded-lg" />
          <LoadingSkeleton className="h-5 w-32" />
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-20" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <LoadingSkeleton className="h-8 w-24" />
              <LoadingSkeleton className="h-5 w-8 rounded-full" />
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <LoadingSkeleton className="h-8 w-28" />
              <LoadingSkeleton className="h-5 w-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1 space-y-1">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};