import React, { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';

const HeroCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const lastFrameRef = useRef(-1);
  const rafRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { alpha: false });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (video.readyState >= 2 && video.duration) {
        const progress = scrollYProgress.get();

        // Map scroll → frame (high resolution)
        const frame = Math.floor(progress * 800);

        if (frame !== lastFrameRef.current) {
          const targetTime = progress * (video.duration - 0.05);

          // Direct & responsive (no laggy smoothing)
          video.currentTime = targetTime;

          lastFrameRef.current = frame;

          const w = window.innerWidth;
          const h = window.innerHeight;

          const vW = video.videoWidth;
          const vH = video.videoHeight;

          const scale = Math.max(w / vW, h / vH);
          const x = (w - vW * scale) / 2;
          const y = (h - vH * scale) / 2;

          ctx.drawImage(video, x, y, vW * scale, vH * scale);
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, scrollYProgress]);

  return (
    <section ref={containerRef} className="relative h-[1000vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

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
          <h1 className="text-8xl md:text-9xl font-black italic text-white uppercase tracking-tighter">
            Burger <span className="text-orange-500">Fever</span>
          </h1>
        </div>

      </div>
    </section>
  );
};

export default React.memo(HeroCanvas);