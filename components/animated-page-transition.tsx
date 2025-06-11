"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedPageTransitionProps {
  children: ReactNode
  currentView: string
}

export function AnimatedPageTransition({ children, currentView }: AnimatedPageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
