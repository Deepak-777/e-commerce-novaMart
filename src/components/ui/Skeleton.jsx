import React from "react"
import { cn } from "../../utils/cn"
import { motion } from "framer-motion"

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  )
}

export function Loader({ className, size = 24 }) {
  return (
    <motion.div
      className={cn("border-2 border-brand-200 border-t-brand-600 rounded-full", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}
