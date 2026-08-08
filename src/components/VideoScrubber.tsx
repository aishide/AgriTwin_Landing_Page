"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sprout, 
  Sparkles, 
  TrendingUp, 
  Droplet, 
  Coins, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowDown 
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface VideoScrubberProps {
  theme: "light" | "dark";
}

const TOTAL_FRAMES = 200;

export default function VideoScrubber({ theme }: VideoScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cover scale calculator (behaves like object-cover)
    const drawCoverImage = (
      c: CanvasRenderingContext2D, 
      img: HTMLImageElement, 
      w: number, 
      h: number
    ) => {
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;

      if (imgRatio > canvasRatio) {
        sw = img.height * canvasRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / canvasRatio;
        sy = (img.height - sh) / 2;
      }

      c.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    };

    const renderFrame = (progress: number) => {
      // Map progress directly to frame index
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      const img = imagesRef.current[frameIndex];
      if (img) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        ctx.clearRect(0, 0, w, h);
        
        if (img.complete) {
          drawCoverImage(ctx, img, w, h);
        } else {
          // Fallback to first complete image
          const fallback = imagesRef.current.find((image) => image.complete);
          if (fallback) {
            drawCoverImage(ctx, fallback, w, h);
          }
        }
      }
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
      renderFrame(scrollProgressRef.current);
    };

    // Preload images
    let loadedCount = 0;
    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === 1) {
        renderFrame(0);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/farmer-frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = handleLoad;
      imagesRef.current.push(img);
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=500%", // 500vh scroll height
      pin: true,
      scrub: 0, // instant seek with zero delay
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        setScrollProgress(self.progress);
        renderFrame(self.progress);
      }
    });

    window.addEventListener("resize", resizeCanvas);
    const timer = setTimeout(resizeCanvas, 100);

    return () => {
      st.kill();
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(timer);
    };
  }, []);

  // Story overlays active brackets
  const showHero = scrollProgress >= 0 && scrollProgress < 0.25;
  const showDiag = scrollProgress >= 0.25 && scrollProgress < 0.50;
  const showSim = scrollProgress >= 0.50 && scrollProgress < 0.75;
  const showLaunch = scrollProgress >= 0.75 && scrollProgress <= 1.0;

  // Compact card theme styles wrapper helper
  const cardThemeClass = theme === "dark"
    ? "backdrop-blur-md bg-[#05070A]/85 border border-emerald-500/30 text-white"
    : "backdrop-blur-md bg-[#FFFFFF]/90 border border-slate-150 shadow-xl text-[#0F172A]";

  return (
    <section 
      ref={containerRef} 
      id="scrollytelling" 
      className="relative w-full min-h-screen bg-[#FFFFFF] dark:bg-[#05070A] transition-colors duration-500 overflow-hidden"
    >
      {/* Background blueprint pattern */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-20 z-10"></div>

      {/* DESKTOP STICKY VIEWPORT DRIVER (large screens) */}
      <div className="hidden lg:block relative w-full h-screen">
        
        {/* Fullscreen Canvas for preloaded images */}
        <div className="absolute inset-0 w-full h-full">
          <canvas 
            ref={canvasRef}
            className="w-full h-full block"
          />
          {/* Subtle background gradient vignette requested for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10"></div>
        </div>

        {/* Floating HUD Cards Grid - Enforcing strict 12-column layout */}
        <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-12 flex items-center w-full h-full pointer-events-none">
          <div className="grid grid-cols-12 gap-8 items-center w-full relative">
            
            {/* LEFT COLUMN LANE (cols 1-4) - Pinned Left Overlays */}
            <div className="col-span-4 col-start-1 h-[320px] relative flex flex-col justify-center">
              
              {/* Card 1: Hero & Twin Scan (0s - 2.5s) */}
              <div 
                className={`transition-all duration-700 transform absolute inset-x-0 ${
                  showHero 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                }`}
              >
                <div className={`p-4 md:p-6 rounded-3xl space-y-3 ${cardThemeClass}`}>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/40 text-[#10B981] dark:text-[#34D399]">
                    <Sprout className="w-3 h-3" />
                    <span>🌱 Neuro-Symbolic AI Platform</span>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
                    AgriTwin OS: Creating Your Digital Twin
                  </h2>
                  <p className="text-[12px] opacity-80 leading-relaxed font-bold">
                    Real-time satellite & drone mapping digitizes your physical farm into an active 3D virtual sandbox.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold opacity-60">
                    <span>Scroll to diagnostics</span>
                    <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Card 3: Virtual Sandbox Simulation (5s - 7.5s) */}
              <div 
                className={`transition-all duration-700 transform absolute inset-x-0 ${
                  showSim 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                }`}
              >
                <div className={`p-4 md:p-6 rounded-3xl space-y-3 ${cardThemeClass}`}>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Risk-Free Virtual Simulation
                  </h2>
                  <p className="text-[12px] opacity-80 leading-relaxed font-bold">
                    Test crop rotations and water schedules in the virtual farm before spending money in the real world.
                  </p>

                  <div className="flex flex-col gap-2 pt-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-amber-100 dark:bg-amber-950/40 rounded-lg">
                        <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
                      </div>
                      <span className="text-[11px] font-extrabold">+25% Profit Boost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-sky-100 dark:bg-sky-950/40 rounded-lg">
                        <Droplet className="w-3.5 h-3.5 text-[#06B6D4]" />
                      </div>
                      <span className="text-[11px] font-extrabold">1,200L Water Saved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-emerald-100 dark:bg-emerald-950/40 rounded-lg">
                        <Coins className="w-3.5 h-3.5 text-[#10B981]" />
                      </div>
                      <span className="text-[11px] font-extrabold">+$420 Carbon Credits</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* CENTER ZONE (cols 5-8) - Pinned 100% Clear of text overlays */}
            <div className="col-span-4 col-start-5 pointer-events-none h-full"></div>

            {/* RIGHT COLUMN LANE (cols 9-12) - Pinned Right Overlays */}
            <div className="col-span-4 col-start-9 h-[320px] relative flex flex-col justify-center">
              
              {/* Card 2: Soil Diagnostics & Do's/Don'ts (2.5s - 5.0s) */}
              <div 
                className={`transition-all duration-700 transform absolute inset-x-0 ${
                  showDiag 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                }`}
              >
                <div className={`p-4 md:p-6 rounded-3xl space-y-3 ${cardThemeClass}`}>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Instant Soil Diagnostics
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-[#EBF4F6] dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700">
                      <span className="opacity-65 font-extrabold block">NPK HEALTH</span>
                      <span className="font-extrabold text-[#10B981] dark:text-[#34D399]">94% Excellent</span>
                    </div>
                    <div className="p-2 bg-[#EBF4F6] dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700">
                      <span className="opacity-65 font-extrabold block">MOISTURE</span>
                      <span className="font-extrabold text-[#06B6D4]">42% Optimum</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px] font-bold">
                    <div className="flex items-start gap-2 p-2 bg-emerald-500/10 border border-[#10B981]/20 rounded-xl">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-[#065F46] dark:text-[#34D399]">
                        <strong>DO:</strong> Tomato Seeds (+22% predicted)
                      </span>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700 dark:text-red-400">
                        <strong>DON'T:</strong> Flood irrigate (Rain forecasted)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Portal & Final CTA (7.5s - 10.0s) */}
              <div 
                className={`transition-all duration-700 transform absolute inset-x-0 ${
                  showLaunch 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                }`}
              >
                <div className={`p-4 md:p-6 rounded-3xl text-center space-y-4 ${cardThemeClass}`}>
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5 text-[#10B981] dark:text-[#34D399] animate-float" />
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight">
                    Ready to Transform Decisions?
                  </h2>
                  <p className="text-[11px] opacity-80 leading-relaxed font-bold">
                    Join thousands of modern farmers optimizing yield and cutting costs.
                  </p>
                  <button
                    onClick={() => setShowLaunchModal(true)}
                    className="w-full py-2.5 bg-[#10B981] dark:bg-[#34D399] text-white dark:text-[#0B0F17] font-sans text-xs font-extrabold rounded-full tracking-wider transition-all duration-300 shadow-farm hover:scale-105 active:scale-95 animate-bounce-slow cursor-pointer"
                  >
                    🚀 Launch Application
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Scroll Progress slider bar */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0B0F17]/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 rounded-full shadow-sm text-[10px] font-sans font-bold text-slate-400 pointer-events-none">
          <span>Simulation Progress</span>
          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#10B981]" 
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-slate-700 dark:text-slate-200">{Math.floor(scrollProgress * 100)}%</span>
        </div>

      </div>

      {/* MOBILE RESPONSIVE LAYOUT (Stacks text cards cleanly above the canvas) */}
      <div className="block lg:hidden max-w-2xl mx-auto px-6 py-24 space-y-8 z-20 relative">
        
        {/* Compact static view of first sequence frame */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg mb-6 bg-slate-100 flex items-center justify-center">
          <span className="text-xs text-slate-400 font-bold">Virtual Twin Active</span>
        </div>

        {/* Mobile Card 1 */}
        <div className={`p-4 rounded-3xl space-y-3 ${cardThemeClass}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/40 text-farm-green">
            <Sprout className="w-3 h-3" />
            <span>🌱 AI PLATFORM</span>
          </div>
          <h3 className="text-lg font-extrabold">
            AgriTwin OS: Creating Your Digital Twin
          </h3>
          <p className="text-xs opacity-80 font-bold">
            Real-time satellite & drone mapping digitizes your physical farm into an active 3D virtual sandbox.
          </p>
        </div>

        {/* Mobile Card 2 */}
        <div className={`p-4 rounded-3xl space-y-3 ${cardThemeClass}`}>
          <h3 className="text-lg font-extrabold">
            Instant Soil Diagnostics
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-[#EBF4F6] dark:bg-slate-800 rounded-xl">
              <span className="opacity-65 font-extrabold block">NPK HEALTH</span>
              <span className="font-bold text-farm-green">94% Excellent</span>
            </div>
            <div className="p-2 bg-[#EBF4F6] dark:bg-slate-800 rounded-xl">
              <span className="opacity-65 font-extrabold block">MOISTURE</span>
              <span className="font-bold text-[#06B6D4]">42% Optimum</span>
            </div>
          </div>
          <div className="space-y-1 text-xs font-bold">
            <div className="text-farm-green">✅ DO: Plant Tomato Hybrid Seeds (+22%)</div>
            <div className="text-red-500">❌ DON'T: Irrigate today — Rain incoming</div>
          </div>
        </div>

        {/* Mobile Card 3 */}
        <div className={`p-4 rounded-3xl space-y-3 ${cardThemeClass}`}>
          <h3 className="text-lg font-extrabold">
            Risk-Free Virtual Simulation
          </h3>
          <p className="text-xs opacity-80 font-bold">
            Test crop rotations and water schedules in the virtual farm before spending money in the real world.
          </p>
          <div className="flex flex-col gap-1.5 pt-1 text-xs font-extrabold opacity-75">
            <div>🏆 +25% Profit Boost</div>
            <div>💧 1,200L Water Saved</div>
            <div>🌱 +$420 Carbon Credits</div>
          </div>
        </div>

        {/* Mobile Card 4 */}
        <div className={`p-4 rounded-3xl text-center space-y-4 ${cardThemeClass}`}>
          <h3 className="text-lg font-extrabold">
            Ready to Transform Your Farm Decisions?
          </h3>
          <button
            onClick={() => setShowLaunchModal(true)}
            className="w-full py-3 bg-[#10B981] dark:bg-[#34D399] text-white dark:text-[#0B0F17] font-sans text-xs font-extrabold rounded-full tracking-wider shadow-farm"
          >
            🚀 Launch Application
          </button>
        </div>
      </div>

      {/* Launch Portal Console Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="glass-bubble p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-farm-lg text-center space-y-4 pointer-events-auto">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-[#10B981] dark:text-[#34D399] animate-float" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              Entering Virtual Twin Sandbox!
            </h3>
            <p className="text-slate-500 dark:text-[#94A3B8] text-xs font-bold leading-relaxed">
              System is synchronizing real-time multispectral drone arrays and loading the Neo4j Knowledge Graph. Prepare for intercropping recommendations!
            </p>
            <div className="bg-[#EBF4F6] dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-[10px] font-sans font-bold text-slate-400">
              SYS_TELEMETRY: ONLINE (v3.2.1-PROLOG)
            </div>
            <button
              onClick={() => setShowLaunchModal(false)}
              className="px-6 py-2.5 bg-[#10B981] dark:bg-[#34D399] text-white dark:text-[#0B0F17] font-sans text-xs font-extrabold rounded-full shadow-farm cursor-pointer"
            >
              Close Console
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
