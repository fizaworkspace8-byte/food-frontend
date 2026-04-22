import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const HeroVideo = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  // PERFORMANCE REFS
  const isRenderingRef = useRef(false);
  const lastTimeRef = useRef(-1);
  
  const [isReady, setIsReady] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Fetch Video as Blob for zero-latency scrubbing
  useEffect(() => {
    const currentVideo = videoRef.current;
    let objectUrl = null;

    const loadVideo = async () => {
      try {
        // NOTE: Use the converted 'burger_scrub.mp4' for best performance
        const response = await fetch('/burger-video/burger_scrub.mp4'); 
        if (!response.ok) throw new Error('Video not found');
        
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        
        if (currentVideo) {
          currentVideo.src = objectUrl;
          currentVideo.load();
        }
      } catch (error) {
        console.error("Error loading video:", error);
        setLoadingError(true);
      }
    };
    
    loadVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  // 2. Optimized Scrubbing Engine
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !isReady || Number.isNaN(video.duration)) return;

    // Map scroll (0-1) to video time
    const targetTime = latest * video.duration;

    // Avoid redundant updates and frame-skipping
    if (!isRenderingRef.current && Math.abs(targetTime - lastTimeRef.current) > 0.01) {
      isRenderingRef.current = true;
      
      requestAnimationFrame(() => {
        if (video) {
          video.currentTime = targetTime;
          lastTimeRef.current = targetTime;
        }
        isRenderingRef.current = false;
      });
    }
  });

  return (
    <section 
      ref={containerRef} 
      className="relative h-[500vh] bg-[#0a0a0a]" 
      style={{ contain: 'paint' }}
    >
      {/* Loading Overlay */}
      {!isReady && !loadingError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <span className="text-white font-mono text-2xl animate-pulse">
              PREPARING YOUR ORDER...
            </span>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {loadingError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <span className="text-red-500 font-mono">Failed to load burger assets.</span>
        </div>
      )}
      
      {/* Video Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover pointer-events-none"
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsReady(true)}
          style={{
            willChange: 'transform',
            filter: 'brightness(0.9)', // Optional: match your cafe vibe
          }}
        />
      </div>

      {/* Optional: Add content overlays here as you scroll */}
      <div className="relative z-10 pointer-events-none">
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-white text-7xl font-bold opacity-0">Scroll for the Sizzle</h1>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroVideo);