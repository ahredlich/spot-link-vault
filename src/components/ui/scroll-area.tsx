import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  scrollbarVariant?: "primary" | "sidebar" | "dialog" | "thick" | "invisible" | "accent";
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, scrollbarVariant = "primary", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden",
      `scrollbar-${scrollbarVariant}`,
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar scrollbarVariant={scrollbarVariant} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

interface ScrollBarProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  scrollbarVariant?: "primary" | "sidebar" | "dialog" | "thick" | "invisible" | "accent";
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", scrollbarVariant = "primary", ...props }, ref) => {
  // Don't render scrollbar for invisible variant
  if (scrollbarVariant === "invisible") {
    return null;
  }

  const getScrollbarStyles = () => {
    const baseStyles = "flex touch-none select-none transition-all duration-200";
    
    switch (scrollbarVariant) {
      case "sidebar":
        return cn(
          baseStyles,
          orientation === "vertical" &&
            "h-full w-1.5 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-1.5 flex-col border-t border-t-transparent p-[1px]"
        );
      case "dialog":
        return cn(
          baseStyles,
          orientation === "vertical" &&
            "h-full w-2 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2 flex-col border-t border-t-transparent p-[1px]"
        );
      case "thick":
        return cn(
          baseStyles,
          orientation === "vertical" &&
            "h-full w-3 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-3 flex-col border-t border-t-transparent p-[1px]"
        );
      case "accent":
        return cn(
          baseStyles,
          orientation === "vertical" &&
            "h-full w-2 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2 flex-col border-t border-t-transparent p-[1px]"
        );
      default: // primary
        return cn(
          baseStyles,
          orientation === "vertical" &&
            "h-full w-2 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2 flex-col border-t border-t-transparent p-[1px]"
        );
    }
  };

  const getThumbStyles = () => {
    const baseThumbStyles = "relative flex-1 rounded-full transition-all duration-200";
    
    switch (scrollbarVariant) {
      case "sidebar":
        return cn(baseThumbStyles, "bg-gradient-to-b from-white/20 to-white/10 hover:from-white/30 hover:to-white/20");
      case "dialog":
        return cn(baseThumbStyles, "bg-gradient-to-b from-white/25 to-white/15 hover:from-white/35 hover:to-white/25 border border-white/10");
      case "thick":
        return cn(baseThumbStyles, "bg-gradient-to-b from-white/30 to-white/20 hover:from-white/40 hover:to-white/30 border border-white/15 shadow-sm");
      case "accent":
        return cn(baseThumbStyles, "bg-gradient-to-b from-primary/40 to-accent/30 hover:from-primary/60 hover:to-accent/50 border border-primary/20");
      default: // primary
        return cn(baseThumbStyles, "bg-gradient-to-b from-white/25 to-white/15 hover:from-white/35 hover:to-white/25 border border-white/10");
    }
  };

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(getScrollbarStyles(), className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={getThumbStyles()} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
})
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
