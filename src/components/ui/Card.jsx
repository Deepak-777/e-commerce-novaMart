import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../utils/cn"

export const Card = React.forwardRef(({ className, glass = false, animated = false, children, ...props }, ref) => {
  const Component = animated ? motion.div : "div"
  
  const animationProps = animated ? {
    whileHover: { y: -4 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  } : {}

  return (
    <Component
      ref={ref}
      className={cn(
        "rounded-[var(--radius-card)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50 shadow-sm",
        glass && "glass-card",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
})
Card.displayName = "Card"

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"
