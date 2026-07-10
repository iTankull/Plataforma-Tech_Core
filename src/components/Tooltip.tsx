import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  term?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  term,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // Adds a tiny exit delay to prevent flickering when mouse leaves slightly
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  // Positional classes for the absolute tooltip box
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  // Animated direction defaults
  const getAnimationProps = () => {
    switch (position) {
      case 'bottom':
        return { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 } };
      case 'left':
        return { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 4 } };
      case 'right':
        return { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -4 } };
      case 'top':
      default:
        return { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 4 } };
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* Target Element */}
      <span className="cursor-help border-b border-dashed border-[#FF3E00]/60 hover:border-[#FF3E00] transition-colors">
        {children}
      </span>

      {/* Floating Tooltip Bubble */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            {...getAnimationProps()}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${getPositionClasses()} z-[100] w-64 p-3 bg-bg-card border-2 border-[#FF3E00] shadow-xl text-text-main rounded-none pointer-events-none select-none`}
          >
            {/* Tiny accent corner indicator */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#FF3E00]" />
            
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#FF3E00] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                {term && (
                  <span className="text-[10px] font-black tracking-widest text-[#FF3E00] uppercase font-mono">
                    {term}
                  </span>
                )}
                <p className="text-[10px] leading-relaxed font-mono font-medium text-text-muted uppercase">
                  {content}
                </p>
              </div>
            </div>
            
            {/* Indicator of interactive help */}
            <div className="mt-1.5 pt-1 border-t border-border-very-subtle text-[8px] font-mono text-text-dim text-right">
              GLOSSÁRIO TÉCNICO // TECH_CORE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
