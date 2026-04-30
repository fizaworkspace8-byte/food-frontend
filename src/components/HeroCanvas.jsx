import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const HeroCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isReady, setIsReady] = useState(false);
  const lastTimeRef = useRef(-1);
  const requestRef = useRef();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. High-DPI Video-to-Canvas Bridge
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    // SCRIPT SAFETY: Initialization Wrap
    try {
      const dpr = window.devicePixelRatio || 1;
      const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        context.scale(dpr, dpr);
        // Draw first frame on resize if ready
        drawFrame();
      };

      const drawFrame = () => {
        try {
          if (video && video.readyState >= 2 && canvas && context) {
            const { innerWidth: w, innerHeight: h } = window;
            const videoRatio = video.videoWidth / video.videoHeight;
            const screenRatio = w / h;

            let drawW, drawH, offsetX = 0, offsetY = 0;

            if (videoRatio > screenRatio) {
              drawH = h;
              drawW = h * videoRatio;
              offsetX = (w - drawW) / 2;
            } else {
              drawW = w;
              drawH = w / videoRatio;
              offsetY = (h - drawH) / 2;
            }

            context.drawImage(video, offsetX, offsetY, drawW, drawH);
          }
        } catch (e) {
          // Non-blocking frame error
        }
      };

      const renderLoop = () => {
        drawFrame();
        requestRef.current = requestAnimationFrame(renderLoop);
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      
      requestRef.current = requestAnimationFrame(renderLoop);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    } catch (err) {
      console.error("Video-Canvas Bridge Initialization Failed:", err);
    }
  }, [isReady]);

  // 2. Scroll-Sync Engine: Mapping scroll position to video.currentTime
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    try {
      const video = videoRef.current;
      if (!video || isNaN(video.duration)) return;

      // Formula: video.currentTime = scrollProgress * video.duration
      const targetTime = latest * video.duration;
      
      if (Math.abs(targetTime - lastTimeRef.current) > 0.001) {
        video.currentTime = targetTime;
        lastTimeRef.current = targetTime;
      }
    } catch (e) {
      // Prevent sync errors from crashing the page
    }
  });

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative h-[500vh] bg-[#050505]"
      style={{ contain: 'paint', zIndex: 0 }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Hidden Video Source for Frame Extraction */}
        <video
          ref={videoRef}
          style={{ display: 'none' }}
          muted
          playsInline
          loop
          preload="auto"
          onLoadedData={() => setIsReady(true)}
        >
          {/* Verified Path: /burger-video/burger_scrub.mp4 */}
          <source src="/burger-video/burger_scrub.mp4" type="video/mp4" />
        </video>

        {/* High-DPI Clarity Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ 
            opacity: isReady ? 1 : 0,
            filter: 'contrast(1.1) brightness(0.9)',
            zIndex: -1, // Audit: Behind UI, but visible
            pointerEvents: 'none'
          }}
        />

        {/* Visibility Loader (Only visible until first frame ready) */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs">Initializing Engine</span>
            </div>
          </div>
        )}

        {/* UI Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
          <div className="text-center">
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white leading-none drop-shadow-2xl">
              BURGER <span className="text-orange-500">FEVER</span>
            </h1>
            <p className="text-gray-400 font-bold tracking-[0.4em] uppercase text-xs mt-4">
              Scroll to witness the sizzle
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroCanvas);