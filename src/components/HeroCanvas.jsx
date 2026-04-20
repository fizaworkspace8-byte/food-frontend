import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 210;

const HeroCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(0);

  // Performance Refs
  const drawParamsRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const lastFrameIndexRef = useRef(-1);
  const requestRef = useRef(null);
  const isRenderingRef = useRef(false);
  const isComponentInView = useRef(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Intersection Observer to kill the engine when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isComponentInView.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Preload Images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const indexStr = i.toString().padStart(3, '0');
      img.src = `/burger-frames/ezgif-frame-${indexStr}.png`;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT || loadedCount % 20 === 0) {
          setLoaded(Math.floor((loadedCount / FRAME_COUNT) * 100));
        }
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
      loadedImages.push(img);
    }
    setImages(loadedImages);
    return () => requestRef.current && cancelAnimationFrame(requestRef.current);
  }, []);

  // 2. Ultra-Smooth Render Logic
  const renderFrame = (progress) => {
    // Stop if out of view or already rendering
    if (!isComponentInView.current || isRenderingRef.current) return;

    const frameIndex = Math.floor(progress * (FRAME_COUNT - 1));
    if (frameIndex === lastFrameIndexRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const img = images[frameIndex];
    if (!img || !img.complete) return;

    isRenderingRef.current = true;

    requestRef.current = requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d', { alpha: false });

      // Toggle smoothing: OFF for movement, ON for the very last frame
      ctx.imageSmoothingEnabled = (progress === 1 || progress === 0);

      const { x, y, width, height } = drawParamsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, width, height);

      lastFrameIndexRef.current = frameIndex;
      isRenderingRef.current = false;
    });
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    renderFrame(latest);
  });

  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;

      // Cap resolution to 1.5x for performance on 4K/Retina screens
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      const img = images[0];
      if (img && img.complete) {
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight;
        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
        }

        const scale = window.innerWidth < 768 ? 0.85 : 1.05;
        drawParamsRef.current = {
          width: drawWidth * scale,
          height: drawHeight * scale,
          x: (canvas.width - drawWidth * scale) / 2,
          y: (canvas.height - drawHeight * scale) / 2
        };
      }
      renderFrame(scrollYProgress.get());
    };

    window.addEventListener('resize', updateDimensions, { passive: true });
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, [images, loaded === 100]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] bg-[#0a0a0a]"
      style={{ contain: 'strict' }} // Highest level of CSS isolation
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)' // GPU acceleration
          }}
        />

        {/* All text overlays remain here (titleOpacity, etc.) */}
      </div>
    </section>
  );
};

export default React.memo(HeroCanvas);