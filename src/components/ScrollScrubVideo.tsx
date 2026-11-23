import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface ScrollScrubVideoProps {
  unlocked: boolean;
}

export function ScrollScrubVideo({ unlocked }: ScrollScrubVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const unlockedOnceRef = useRef(false);

  // Unlock mobile/iOS video frame decoding on the user's first enter gesture
  useEffect(() => {
    const video = videoRef.current;
    if (!unlocked || !video || unlockedOnceRef.current) return;
    unlockedOnceRef.current = true;

    const prime = async () => {
      try {
        await video.play();
        video.pause();
        video.currentTime = 0;
      } catch {
        // Browsers that allow programmatic seeking without play() work seamlessly
        video.pause();
        video.currentTime = 0;
      }
    };
    void prime();
  }, [unlocked]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const updateTargetFromScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const raw = window.scrollY / maxScroll;
      targetProgressRef.current = Math.min(1, Math.max(0, raw));
      scheduleLoop();
    };

    const step = () => {
      rafIdRef.current = null;
      const el = videoRef.current;
      if (!el) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Smoothly ease toward scroll target (snaps cleanly to 0 when scrolled back to top)
      const next = Math.abs(diff) < 0.0008 ? target : current + diff * 0.16;
      currentProgressRef.current = next;

      if (el.readyState >= 1 && Number.isFinite(el.duration) && el.duration > 0) {
        const desiredTime = next <= 0.001 ? 0 : next * el.duration;
        if (!el.seeking && Math.abs(el.currentTime - desiredTime) > 0.015) {
          el.currentTime = desiredTime;
        }
      }

      if (Math.abs(target - next) >= 0.0008) {
        rafIdRef.current = window.requestAnimationFrame(step);
      }
    };

    const scheduleLoop = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(step);
      }
    };

    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0;
      updateTargetFromScroll();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', updateTargetFromScroll, { passive: true });

    updateTargetFromScroll();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', updateTargetFromScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#2B1D0E]"
      aria-hidden="true"
    >
      {!hasError ? (
        <video
          ref={videoRef}
          src="/videos/rolex-backdrop.mp4"
          muted
          playsInline
          preload="auto"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#3B2610] via-[#6A4519] to-[#1F1612]" />
      )}

      {/* Subtle warm espresso veil so borderless typography & cakes always stay legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140F0B]/50 via-[#140F0B]/48 to-[#140F0B]/60" />
    </div>
  );
}
