import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        link: "text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Enhanced glass variants with improved hover states and transforms
        glass: "backdrop-blur-lg border border-white/20 bg-gradient-to-r from-white/10 to-white/5 text-foreground hover:from-white/20 hover:to-white/15 shadow-glass-sm hover:shadow-glass-md hover:scale-[1.02] hover:-translate-y-1 focus-ring-glass",
        "glass-primary": "backdrop-blur-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 text-primary hover:from-primary/20 hover:to-accent/20 shadow-glass-sm hover:shadow-glass-lg hover:scale-[1.02] hover:-translate-y-1 focus-ring-glass",
        "glass-secondary": "backdrop-blur-lg border border-white/15 bg-gradient-to-r from-white/8 to-white/3 text-foreground/80 hover:from-white/15 hover:to-white/10 hover:text-foreground shadow-glass-sm hover:shadow-glass-md hover:scale-[1.01] hover:-translate-y-0.5 focus-ring-glass",
        "glass-accent": "backdrop-blur-lg border border-accent/20 bg-gradient-to-r from-accent/10 to-primary/10 text-accent hover:from-accent/20 hover:to-primary/20 shadow-glass-sm hover:shadow-glass-lg hover:scale-[1.02] hover:-translate-y-1 focus-ring-glass",
        // Enhanced toggle variants with gradient-based selected states
        "glass-toggle": "backdrop-blur-lg border border-white/15 bg-gradient-to-r from-white/5 to-transparent text-foreground/70 hover:from-white/15 hover:to-white/5 hover:text-foreground shadow-glass-sm hover:shadow-glass-md hover:scale-[1.01] focus-ring-glass data-[state=on]:from-primary/20 data-[state=on]:to-accent/20 data-[state=on]:border-primary/30 data-[state=on]:text-primary data-[state=on]:shadow-glass-md",
        "glass-toggle-primary": "backdrop-blur-lg border border-primary/15 bg-gradient-to-r from-primary/5 to-transparent text-primary/70 hover:from-primary/15 hover:to-primary/5 hover:text-primary shadow-glass-sm hover:shadow-glass-md hover:scale-[1.01] focus-ring-glass data-[state=on]:from-primary/25 data-[state=on]:to-accent/25 data-[state=on]:border-primary/40 data-[state=on]:text-primary data-[state=on]:shadow-glass-lg data-[state=on]:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
