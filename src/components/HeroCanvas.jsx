import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 210;

const HeroCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // PERFORMANCE REFS: Use Refs for anything that changes rapidly
  const imagesRef = useRef([]); 
  const drawParamsRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const lastFrameIndexRef = useRef(-1);
  const isRenderingRef = useRef(false);
  const isComponentInView = useRef(true);
  
  // STATE: Only use state for UI elements (like a loader)
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isComponentInView.current = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Optimized Preloader
  useEffect(() => {
    let loadedCount = 0;
    const tempImages = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const indexStr = i.toString().padStart(3, '0');
      // Using the optimized webp files you generated
      img.src = `/burger-frames/ezgif-frame-${indexStr}.webp`;
      
      img.onload = () => {
        loadedCount++;
        setProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = tempImages;
          setIsReady(true);
          // Draw initial frame
          renderFrame(0);
        }
      };
      tempImages.push(img);
    }
  }, []);

  // 3. Ultra-Fast Render Engine
  const renderFrame = (scrollVal) => {
    if (!isComponentInView.current || imagesRef.current.length === 0 || !canvasRef.current) return;

    const frameIndex = Math.floor(scrollVal * (FRAME_COUNT - 1));
    
    // Skip if we are already showing this frame
    if (frameIndex === lastFrameIndexRef.current) return;

    // Skip if the GPU is still busy drawing the last request
    if (isRenderingRef.current) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    isRenderingRef.current = true;

    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d', { alpha: false }); // Performance optimization
      const { x, y, width, height } = drawParamsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, width, height);

      lastFrameIndexRef.current = frameIndex;
      isRenderingRef.current = false;
    });
  };

  // Listen to scroll changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    renderFrame(latest);
  });

  // 4. Handle Sizing and DPR
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Cap at 1.5 to prevent memory crashes on high-res mobile screens
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      // Fit Image to Canvas (Cover logic)
      const imgWidth = 1920; // Original width
      const imgHeight = 1080; // Original height
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvas.width / canvas.height;

      let dW, dH;
      if (canvasRatio > imgRatio) {
        dW = canvas.width;
        dH = canvas.width / imgRatio;
      } else {
        dH = canvas.height;
        dW = canvas.height * imgRatio;
      }

      drawParamsRef.current = {
        width: dW,
        height: dH,
        x: (canvas.width - dW) / 2,
        y: (canvas.height - dH) / 2
      };

      renderFrame(scrollYProgress.get());
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isReady]);

  return (
    <section 
        ref={containerRef} 
        className="relative h-[500vh] bg-[#0a0a0a]" 
        style={{ contain: 'paint' }}
    >
      {!isReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <span className="text-white font-mono text-2xl">COOKING... {progress}%</span>
        </div>
      )}
      
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            willChange: 'transform',
            imageRendering: 'crisp-edges'
          }}
        />
      </div>
    </section>
  );
};

export default React.memo(HeroCanvas);