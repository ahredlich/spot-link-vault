import React, { useState, useRef, useEffect } from "react";
import { Search, X, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showResultsCount?: boolean;
  resultsCount?: number;
  totalCount?: number;
  onQuickFilter?: (filter: 'favorites' | 'recent' | 'clear') => void;
  showQuickFilters?: boolean;
}

export const EnhancedSearchInput: React.FC<EnhancedSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search bookmarks, tags, or descriptions...",
  className,
  showResultsCount = false,
  resultsCount = 0,
  totalCount = 0,
  onQuickFilter,
  showQuickFilters = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const hasValue = value.length > 0;
  const isSearching = hasValue;

  return (
    <div className="relative flex-1 max-w-xs sm:max-w-sm">
      <div className={cn(
        "relative group",
        className
      )}>
        {/* Search Icon */}
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200",
          isFocused || hasValue 
            ? "text-primary" 
            : "text-muted-foreground"
        )} />
        
        {/* Input Field */}
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-10 search-glass-enhanced text-sm transition-all duration-300",
            isFocused && "search-glass-focused",
            hasValue && "search-glass-active"
          )}
        />
        
        {/* Clear Button */}
        {hasValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0",
              "hover:bg-white/20 text-muted-foreground hover:text-foreground",
              "transition-all duration-200 opacity-0 group-hover:opacity-100",
              hasValue && "opacity-100"
            )}
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Quick Filter Buttons */}
      {showQuickFilters && onQuickFilter && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20">
          <div className="glass-card-secondary p-2 border border-white/10 rounded-md shadow-lg backdrop-blur-xl">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickFilter('favorites')}
                className="h-6 px-2 text-xs gap-1 hover:bg-white/20 text-muted-foreground hover:text-foreground"
              >
                <Star className="h-3 w-3" />
                Favorites
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickFilter('recent')}
                className="h-6 px-2 text-xs gap-1 hover:bg-white/20 text-muted-foreground hover:text-foreground"
              >
                <Clock className="h-3 w-3" />
                Recent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickFilter('clear')}
                className="h-6 px-2 text-xs hover:bg-white/20 text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Results Summary */}
      {showResultsCount && (isSearching || resultsCount !== totalCount) && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10">
          <div className="glass-card-secondary px-3 py-2 text-xs text-muted-foreground border border-white/10 rounded-md shadow-lg backdrop-blur-xl">
            {resultsCount === 0 ? (
              <span className="text-amber-600">
                {isSearching ? `No results found for "${value}"` : "No bookmarks match current filters"}
              </span>
            ) : (
              <span>
                {isSearching ? (
                  <>Found <span className="text-primary font-medium">{resultsCount}</span> of {totalCount} bookmarks</>
                ) : (
                  <>Showing <span className="text-primary font-medium">{resultsCount}</span> of {totalCount} bookmarks</>
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};