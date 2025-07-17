import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        // Enhanced glass toggle variants with gradient-based selected states
        glass: "backdrop-blur-lg border border-white/15 bg-gradient-to-r from-white/5 to-transparent text-foreground/70 hover:from-white/15 hover:to-white/5 hover:text-foreground shadow-glass-sm hover:shadow-glass-md hover:scale-[1.01] focus-ring-glass data-[state=on]:from-primary/20 data-[state=on]:to-accent/20 data-[state=on]:border-primary/30 data-[state=on]:text-primary data-[state=on]:shadow-glass-md data-[state=on]:scale-[1.01]",
        "glass-primary": "backdrop-blur-lg border border-primary/15 bg-gradient-to-r from-primary/5 to-transparent text-primary/70 hover:from-primary/15 hover:to-primary/5 hover:text-primary shadow-glass-sm hover:shadow-glass-md hover:scale-[1.01] focus-ring-glass data-[state=on]:from-primary/25 data-[state=on]:to-accent/25 data-[state=on]:border-primary/40 data-[state=on]:text-primary data-[state=on]:shadow-glass-lg data-[state=on]:scale-[1.02]",
        "glass-secondary": "backdrop-blur-lg border border-white/10 bg-gradient-to-r from-white/3 to-transparent text-foreground/60 hover:from-white/10 hover:to-white/3 hover:text-foreground/80 shadow-glass-sm hover:shadow-glass-md hover:scale-[1.005] focus-ring-glass data-[state=on]:from-white/20 data-[state=on]:to-white/10 data-[state=on]:border-white/25 data-[state=on]:text-foreground data-[state=on]:shadow-glass-md data-[state=on]:scale-[1.01]",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
