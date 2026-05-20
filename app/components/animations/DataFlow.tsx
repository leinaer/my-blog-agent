"use client";

import { motion } from "framer-motion";

interface DataFlowProps {
  className?: string;
}

export function DataFlow({ className }: DataFlowProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated data flow lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 0 ${80 + i * 60} Q 200 ${50 + i * 70} 400 ${80 + i * 60} T 800 ${80 + i * 60}`}
            stroke="url(#flowGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}
