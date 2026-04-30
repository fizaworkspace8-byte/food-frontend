import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';

const HeroCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const lastTimeRef = useRef(0);
  const scrollHistory = useRef([]); // Stabilizer for the middle section

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Heavy-duty physics for the "Liquid" middle
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,   // Reduced further for maximum "glide"
    damping: 35,     // High damping to eliminate micro-oscillations
    restDelta: 0.0001
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    const render = () => {
      if (video.readyState >= 2 && !isNaN(video.duration)) {
        const raw = scrollYProgress.get();
        const smoothed = smoothProgress.get();

        // 1. THE STABILIZER ENGINE
        // We keep a small history of scroll values to calculate a moving average.
        // This completely removes "jitter" from mouse wheels or trackpads.
        scrollHistory.current.push(smoothed);
        if (scrollHistory.current.length > 5) scrollHistory.current.shift();
        const stabilizedProgress = scrollHistory.current.reduce((a, b) => a + b) / scrollHistory.current.length;

        // 2. THE DYNAMIC BRIDGE
        // 0-30%: Raw 1:1 input (The "Electric Start" you loved)
        // 30-100%: Stabilized Glide (The "Liquid Middle")
        let activeProgress;
        if (raw < 0.30) {
          activeProgress = raw;
        } else {
          const t = Math.min((raw - 0.30) / 0.20, 1); // 20% transition zone
          activeProgress = raw * (1 - t) + stabilizedProgress * t;
        }

        // 3. VARIABLE SEEK VELOCITY
        // Instant response at the start, weighted "Honey" feel in the middle
        const seekVelocity = raw < 0.30 ? 0.98 : 0.10;

        const targetTime = activeProgress * (video.duration - 0.15);
        const nextTime = lastTimeRef.current + (targetTime - lastTimeRef.current) * seekVelocity;

        if (Math.abs(nextTime - video.currentTime) > 0.0005) {
          video.currentTime = nextTime;
        }
        lastTimeRef.current = nextTime;

        // 4. DRAWING
        const { innerWidth: w, innerHeight: h } = window;
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        const scale = Math.max(w / vW, h / vH);
        const x = (w - vW * scale) / 2;
        const y = (h - vH * scale) / 2;

        context.drawImage(video, x, y, vW * scale, vH * scale);
      }
      requestAnimationFrame(render);
    };

    const handleResize = () => {
      // 1.5 DPR is the gold standard for performance vs. quality balance
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    const animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isReady]);

  return (
    <section ref={containerRef} className="relative h-[1000vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        <video
          ref={videoRef}
          className="hidden"
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsReady(true)}
        >
          <source src="/burger-video/compressed_burger.mp4" type="video/mp4" />
        </video>

        <canvas
          ref={canvasRef}
          style={{
            opacity: isReady ? 1 : 0,
            zIndex: -1,
            pointerEvents: 'none',
            willChange: 'transform'
          }}
        />

        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="w-8 h-8 border-t-2 border-orange-500 rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <h1 className="text-8xl md:text-9xl font-black italic text-white drop-shadow-2xl uppercase tracking-tighter">
            Burger <span className="text-orange-500">Fever</span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroCanvas);