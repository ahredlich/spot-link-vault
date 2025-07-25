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
  activeQuickFilter?: 'favorites' | 'recent' | null;
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
  activeQuickFilter = null,
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
    <div className="relative flex-1 max-w-xs sm:max-w-sm search-dropdown-container">
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
      
      {/* Quick Filter Buttons - Removed dropdown indicators */}
      
      {/* Search Results Summary - Removed dropdown indicators */}
    </div>
  );
};