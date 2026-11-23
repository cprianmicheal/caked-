import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface ScrollFadeSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Bidirectional scroll-driven visibility wrapper:
 * - Invisible below the viewport before you reach it
 * - Smoothly rises & fades in as you scroll to it
 * - Smoothly rises & disappears completely once you scroll past it
 * - Reappears seamlessly if you scroll back up to it
 */
export function ScrollFadeSection({ id, className = '', children }: ScrollFadeSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // 0 = section top hits 92% down viewport; 1 = section bottom hits 8% from top
    offset: ['start 0.92', 'end 0.08'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.16, 0.82, 1], [48, 0, 0, -48]);

  return (
    <section ref={containerRef} id={id} className={className}>
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity, y }}
        className="will-change-[transform,opacity]"
      >
        {children}
      </motion.div>
    </section>
  );
}
