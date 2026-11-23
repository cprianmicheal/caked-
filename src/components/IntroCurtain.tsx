import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { INTRO_CAKE_IMAGE } from '../data/patisserie';

interface IntroCurtainProps {
  visible: boolean;
  onEnter: () => void;
}

function IntroCrown({ className = 'w-7 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 19L3 8.5L11 13.5L18 4.5L25 13.5L33 8.5L31 19H5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 21.5H31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="3" cy="6.5" r="1.4" fill="currentColor" />
      <circle cx="18" cy="2.5" r="1.6" fill="currentColor" />
      <circle cx="33" cy="6.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function IntroCurtain({ visible, onEnter }: IntroCurtainProps) {
  const prefersReducedMotion = useReducedMotion();
  const touchStartY = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (visible) {
      triggeredRef.current = false;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const triggerEnter = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      onEnter();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onEnter]);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 10 && !triggeredRef.current) {
      triggeredRef.current = true;
      onEnter();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || triggeredRef.current) return;
    const currentY = e.touches[0]?.clientY ?? touchStartY.current;
    if (Math.abs(touchStartY.current - currentY) > 20) {
      triggeredRef.current = true;
      onEnter();
    }
  };

  const handleTap = () => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    onEnter();
  };

  return (
    <motion.div
      initial={false}
      animate={
        visible
          ? { y: '0%', opacity: 1, pointerEvents: 'auto' as const }
          : { y: '-100%', opacity: 0, pointerEvents: 'none' as const }
      }
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.72, ease: [0.16, 1, 0.3, 1] }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleTap}
      role="dialog"
      aria-modal="true"
      aria-label="Rolex Patisserie entrance"
      aria-hidden={!visible}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#EAD8C3] select-none cursor-pointer"
    >
      {/* Ambient Animated Background Silk Layer (fills wide desktop screens seamlessly) */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                scale: [1.06, 1.12, 1.06],
                rotate: [-0.8, 0.8, -0.8],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <img
          src={INTRO_CAKE_IMAGE}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover blur-2xl opacity-55 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211C1B]/55 via-[#EAD8C3]/20 to-[#211C1B]/75" />
      </motion.div>

      {/* Main Rolling / Levitating Red Velvet Cake Showcase */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-8 sm:py-10 px-6">
        {/* Top Brand Header */}
        <div className="flex flex-col items-center text-white drop-shadow-sm">
          <IntroCrown className="w-7 h-5 text-white/95" />
          <span className="text-xl sm:text-2xl tracking-[0.28em] font-semibold mt-1">
            ROLEX
          </span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-white/85 mt-1">
            ÉLÉGANT PATISSERIE
          </span>
        </div>

        {/* Centerpiece Rolling Artwork */}
        <div className="relative flex items-center justify-center my-auto w-full max-w-[380px] sm:max-w-[430px] md:max-w-[460px] aspect-[9/13] max-h-[64vh] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(33,28,27,0.35)] border border-white/30 bg-[#E8D5BF]">
          <motion.img
            src={INTRO_CAKE_IMAGE}
            alt="Levitating three-layer red velvet cake slice with meringue peaks"
            referrerPolicy="no-referrer"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [-10, 10, -10],
                    scale: [1.03, 1.09, 1.03],
                    rotate: [-1.4, 1.4, -1.4],
                  }
            }
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full object-cover"
          />

          {/* Subtle Shimmer Sweep simulating living motion */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              animate={{ x: ['-120%', '140%'] }}
              transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
            />
          )}
        </div>

        {/* Bottom Tap-or-Scroll Prompt */}
        <div className="flex flex-col items-center text-center text-white">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTap();
            }}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-[#1D1918] text-xs font-semibold tracking-[0.16em] uppercase shadow-lg hover:bg-stone-100 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <span>Tap or Scroll to Enter</span>
            <motion.span
              animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>
          <p className="text-[11px] tracking-[0.18em] uppercase text-white/80 mt-2.5">
            Velours Crimson Edition
          </p>
        </div>
      </div>
    </motion.div>
  );
}
