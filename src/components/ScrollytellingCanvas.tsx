"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sprout, 
  Sparkles, 
  Sun,
  Moon,
  Droplet,
  Heart,
  CloudRain,
  Coins
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollytellingCanvasProps {
  theme: "light" | "dark";
}

export default function ScrollytellingCanvas({ theme }: ScrollytellingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  const scrollProgressRef = useRef(0);

  // Set current scene based on scroll progress
  useEffect(() => {
    const p = scrollProgress;
    if (p < 0.15) setCurrentScene(0);
    else if (p < 0.30) setCurrentScene(1);
    else if (p < 0.45) setCurrentScene(2);
    else if (p < 0.60) setCurrentScene(3);
    else if (p < 0.75) setCurrentScene(4);
    else if (p < 0.90) setCurrentScene(5);
    else setCurrentScene(6);
  }, [scrollProgress]);

  // Redraw canvas on theme change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawScene(ctx, scrollProgressRef.current, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      // Get container dimensions
      const width = canvas.parentElement?.clientWidth || 500;
      const height = canvas.parentElement?.clientHeight || 600;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
      drawScene(ctx, scrollProgressRef.current, width, height);
    };

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=600%", // 600vh scroll height
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        setScrollProgress(self.progress);
        resizeCanvas();
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

  // Main Scene drawing loop
  const drawScene = (
    ctx: CanvasRenderingContext2D, 
    p: number, 
    width: number, 
    height: number
  ) => {
    const isDark = theme === "dark";

    // 1. Clear backgrounds (mapped to hex codes)
    ctx.fillStyle = isDark ? "#0B0F17" : "#FBF9F1";
    ctx.fillRect(0, 0, width, height);

    // Draw background gradients
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      bgGrad.addColorStop(0, "#0B0F17");
      bgGrad.addColorStop(1, "#0F172A");
    } else {
      bgGrad.addColorStop(0, "#FBF9F1");
      bgGrad.addColorStop(1, "#EBF4F6");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Rolling hills in background
    ctx.fillStyle = isDark ? "#064e3b" : "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(width * 0.4, height - 180, width, height - 120);
    ctx.lineTo(width, height);
    ctx.fill();

    ctx.fillStyle = isDark ? "#059669" : "#10B981";
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(width * 0.75, height - 140, width, height - 80);
    ctx.lineTo(width, height);
    ctx.fill();

    // Soil bed
    ctx.fillStyle = isDark ? "#1c1917" : "#78350f";
    ctx.fillRect(0, height - 50, width, 50);

    // 3. Define Phone coordinates (centered-right, large mock)
    const phoneW = 200;
    const phoneH = 380;
    const phoneX = Math.max(width * 0.62, width - phoneW - 30);
    const phoneY = height / 2 - phoneH / 2;

    // Draw Farmer Raj standing on the left side, gesturing to the phone
    const rajX = Math.min(width * 0.28, phoneX - 70);
    const rajY = height / 2 + 100;
    
    // Expressive state for Raj
    let rajExpression: "puzzled" | "happy" | "waving" | "driving" = "happy";
    if (p < 0.15) rajExpression = "puzzled";
    else if (p >= 0.75 && p < 0.90) rajExpression = "waving";
    
    drawFarmerRaj(ctx, rajX, rajY, rajExpression, isDark);

    // 4. Draw Phone Mockup Frame
    drawPhoneMockup(ctx, phoneX, phoneY, phoneW, phoneH, isDark);

    // 5. Draw Content inside the Phone screen mockup
    const screenX = phoneX + 8;
    const screenY = phoneY + 8;
    const screenW = phoneW - 16;
    const screenH = phoneH - 16;
    drawPhoneScreenContent(ctx, p, screenX, screenY, screenW, screenH, isDark);
  };

  // Farmer Raj Vector drawing
  const drawFarmerRaj = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    expression: "puzzled" | "happy" | "waving" | "driving", 
    isDark: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);

    const skinColor = "#fed7aa";

    // Straps and shirt
    ctx.fillStyle = isDark ? "#4f46e5" : "#3b82f6";
    ctx.fillRect(-12, 16, 5, 25);
    ctx.fillRect(7, 16, 5, 25);
    
    ctx.fillStyle = "#f97316"; // orange shirt
    ctx.beginPath();
    ctx.roundRect(-16, 20, 32, 20, 6);
    ctx.fill();

    // Face
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Straw Hat
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.ellipse(0, -12, 22, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -13, 12, Math.PI, 0, false);
    ctx.fill();

    // Face details
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(-5, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (expression === "puzzled") {
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-4, 5);
      ctx.quadraticCurveTo(0, 3, 4, 5);
      ctx.stroke();

      // Puzzled question mark
      ctx.fillStyle = isDark ? "#34D399" : "#065F46";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("?", 18, -20 + Math.sin(Date.now() / 150) * 3);
    } else {
      ctx.fillStyle = "#e11d48";
      ctx.beginPath();
      ctx.arc(0, 3, 4, 0, Math.PI, false);
      ctx.fill();
    }

    // Waving arm
    if (expression === "waving") {
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(14, 20);
      ctx.lineTo(24, -4 + Math.sin(Date.now() / 100) * 4);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Smartphone mockup frame
  const drawPhoneMockup = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    isDark: boolean
  ) => {
    ctx.save();
    // Shadow
    ctx.shadowColor = isDark ? "rgba(0,0,0,0.5)" : "rgba(30,41,59,0.12)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    // Frame outer
    ctx.fillStyle = isDark ? "#1e293b" : "#1E293B";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 28);
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Notch speaker
    ctx.fillStyle = isDark ? "#0f172a" : "#0f172a";
    ctx.beginPath();
    ctx.roundRect(x + w / 2 - 35, y + 6, 70, 10, 5);
    ctx.fill();

    ctx.restore();
  };

  // Screen updates based on scroll index
  const drawPhoneScreenContent = (
    ctx: CanvasRenderingContext2D, 
    p: number, 
    sx: number, 
    sy: number, 
    sw: number, 
    sh: number, 
    isDark: boolean
  ) => {
    // Screen background
    ctx.fillStyle = isDark ? "#0F172A" : "#FFFFFF";
    ctx.fillRect(sx, sy, sw, sh);

    // Common screen clipping
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(sx, sy, sw, sh, 20);
    ctx.clip();

    // Scene Selector
    if (p < 0.15) {
      // SCENE 1: sunlit open field inside phone
      drawPhoneScene1(ctx, sx, sy, sw, sh, isDark);
    } else if (p < 0.30) {
      // SCENE 2: digital scanning laser grid sweep
      const sp = (p - 0.15) / 0.15;
      drawPhoneScene2(ctx, sp, sx, sy, sw, sh, isDark);
    } else if (p < 0.45) {
      // SCENE 3: diagnostics & bubbles
      const sp = (p - 0.30) / 0.15;
      drawPhoneScene3(ctx, sp, sx, sy, sw, sh, isDark);
    } else if (p < 0.60) {
      // SCENE 4: DO/DONT recommendations
      const sp = (p - 0.45) / 0.15;
      drawPhoneScene4(ctx, sp, sx, sy, sw, sh, isDark);
    } else if (p < 0.75) {
      // SCENE 5: Simulated seeding & plant growth
      const sp = (p - 0.60) / 0.15;
      drawPhoneScene5(ctx, sp, sx, sy, sw, sh, isDark);
    } else if (p < 0.90) {
      // SCENE 6: Real world tractor harvest output
      const sp = (p - 0.75) / 0.15;
      drawPhoneScene6(ctx, sp, sx, sy, sw, sh, isDark);
    } else {
      // SCENE 7: launch portal CTA card
      const sp = (p - 0.90) / 0.10;
      drawPhoneScene7(ctx, sp, sx, sy, sw, sh, isDark);
    }

    ctx.restore();
  };

  const drawPhoneScene1 = (ctx: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    // Sky
    ctx.fillStyle = isDark ? "#172554" : "#bae6fd";
    ctx.fillRect(sx, sy, sw, sh);

    // Sun/Moon
    ctx.fillStyle = isDark ? "#e2e8f0" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(sx + sw - 30, sy + 40, 10, 0, Math.PI * 2);
    ctx.fill();

    // Hills
    ctx.fillStyle = isDark ? "#064e3b" : "#10B981";
    ctx.beginPath();
    ctx.moveTo(sx, sy + sh);
    ctx.quadraticCurveTo(sx + sw * 0.5, sy + sh - 80, sx + sw, sy + sh - 50);
    ctx.lineTo(sx + sw, sy + sh);
    ctx.fill();

    // Soil
    ctx.fillStyle = isDark ? "#1c1917" : "#78350f";
    ctx.fillRect(sx, sy + sh - 30, sw, 30);
  };

  const drawPhoneScene2 = (ctx: CanvasRenderingContext2D, sp: number, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    drawPhoneScene1(ctx, sx, sy, sw, sh, isDark);

    // Laser scanning horizontal line sweeps down
    const laserY = sy + 50 + sp * (sh - 80);
    ctx.strokeStyle = isDark ? "#06B6D4" : "#10B981";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(sx, laserY);
    ctx.lineTo(sx + sw, laserY);
    ctx.stroke();

    // Grid wireframes
    ctx.strokeStyle = isDark ? "rgba(6,182,212,0.25)" : "rgba(16,185,129,0.25)";
    ctx.lineWidth = 1;
    for (let x = sx + 15; x < sx + sw; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, sy + sh - 50);
      ctx.lineTo(x, sy + sh);
      ctx.stroke();
    }
  };

  const drawPhoneScene3 = (ctx: CanvasRenderingContext2D, sp: number, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    ctx.fillStyle = isDark ? "#0F172A" : "#FFFFFF";
    ctx.fillRect(sx, sy, sw, sh);

    ctx.fillStyle = isDark ? "#F8FAFC" : "#1E293B";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("SOIL ANALYSIS", sx + 15, sy + 30);

    const barW = sw - 30;
    const barH = 14;
    const barX = sx + 15;

    // Draw NPK, Moisture progress lines
    if (sp > 0.2) {
      ctx.fillStyle = isDark ? "rgba(52, 211, 153, 0.15)" : "#EBF4F6";
      ctx.fillRect(barX, sy + 60, barW, barH);
      ctx.fillStyle = "#10B981";
      ctx.fillRect(barX, sy + 60, barW * 0.95 * Math.min(1.0, (sp - 0.2) / 0.8), barH);
      ctx.fillStyle = isDark ? "#F8FAFC" : "#1E293B";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("NPK Nutrients: 95%", barX + 6, sy + 71);
    }

    if (sp > 0.5) {
      ctx.fillStyle = isDark ? "rgba(6, 182, 212, 0.15)" : "#EBF4F6";
      ctx.fillRect(barX, sy + 90, barW, barH);
      ctx.fillStyle = "#06B6D4";
      ctx.fillRect(barX, sy + 90, barW * 0.42 * Math.min(1.0, (sp - 0.5) / 0.5), barH);
      ctx.fillStyle = isDark ? "#F8FAFC" : "#1E293B";
      ctx.fillText("Moisture: 42%", barX + 6, sy + 101);
    }
  };

  const drawPhoneScene4 = (ctx: CanvasRenderingContext2D, sp: number, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    ctx.fillStyle = isDark ? "#0F172A" : "#FFFFFF";
    ctx.fillRect(sx, sy, sw, sh);

    ctx.fillStyle = isDark ? "#F8FAFC" : "#1E293B";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("RECOMMENDATIONS", sx + 12, sy + 30);

    const cardW = sw - 20;
    const cardH = 65;
    const cardX = sx + 10;

    // DO Card
    if (sp > 0.2) {
      ctx.fillStyle = isDark ? "rgba(52, 211, 153, 0.15)" : "#EBF4F6";
      ctx.strokeStyle = isDark ? "#34D399" : "#10B981";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, sy + 50, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? "#34D399" : "#065F46";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("✅ DO: SOW TOMATOES", cardX + 10, sy + 68);
      ctx.fillStyle = isDark ? "#94A3B8" : "#1E293B";
      ctx.fillText("+22% profit expected.", cardX + 10, sy + 82);
      ctx.fillText("Plant this week.", cardX + 10, sy + 94);
    }

    // DONT Card
    if (sp > 0.5) {
      ctx.fillStyle = isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)";
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, sy + 130, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.fillText("❌ DON'T: IRRIGATE TODAY", cardX + 10, sy + 148);
      ctx.fillStyle = isDark ? "#94A3B8" : "#1E293B";
      ctx.fillText("Rain in 18 hours.", cardX + 10, sy + 162);
      ctx.fillText("Save water risk-free.", cardX + 10, sy + 174);
    }
  };

  const drawPhoneScene5 = (ctx: CanvasRenderingContext2D, sp: number, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    // Seed planting / Sprout growth inside phone
    drawPhoneScene1(ctx, sx, sy, sw, sh, isDark);

    const baseValY = sy + sh - 30;

    // Seeds falling and sprouts growing
    const points = [
      { x: sx + sw * 0.25, maxH: 25 },
      { x: sx + sw * 0.5, maxH: 35 },
      { x: sx + sw * 0.75, maxH: 28 },
    ];

    points.forEach((pt) => {
      // Draw growing stems
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pt.x, baseValY);
      ctx.lineTo(pt.x, baseValY - pt.maxH * sp);
      ctx.stroke();

      if (sp > 0.5) {
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        ctx.arc(pt.x - 5, baseValY - pt.maxH * sp, 3, 0, Math.PI * 2);
        ctx.arc(pt.x + 5, baseValY - pt.maxH * sp, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawPhoneScene6 = (ctx: CanvasRenderingContext2D, sp: number, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    // Real world tractor and water saved badge
    ctx.fillStyle = isDark ? "#0F172A" : "#FFFFFF";
    ctx.fillRect(sx, sy, sw, sh);

    ctx.fillStyle = isDark ? "#F8FAFC" : "#1E293B";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("LIVE IRRIGATE DATA", sx + 12, sy + 30);

    // Tractor icon drawing on screen
    drawTractor(ctx, sx + sw / 2, sy + 75, isDark);

    if (sp > 0.4) {
      // Water saved badge
      ctx.fillStyle = isDark ? "rgba(6, 182, 212, 0.15)" : "#EBF4F6";
      ctx.strokeStyle = "#06B6D4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(sx + 10, sy + 130, sw - 20, 45, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#06b6d4";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("💧 1,200L WATER SAVED", sx + 20, sy + 148);
      ctx.fillStyle = isDark ? "#94A3B8" : "#1E293B";
      ctx.fillText("Rain sensor sync: 100% active", sx + 20, sy + 162);
    }
  };

  const drawPhoneScene7 = (ctx: CanvasRenderingContext2D, sp: number, sx: number, sy: number, sw: number, sh: number, isDark: boolean) => {
    ctx.fillStyle = isDark ? "#0F172A" : "#FFFFFF";
    ctx.fillRect(sx, sy, sw, sh);

    // Launch cards text
    ctx.fillStyle = isDark ? "#F8FAFC" : "#1E293B";
    ctx.font = "extrabold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AGRITWIN SANDBOX", sx + sw / 2, sy + sh / 2 - 20);

    ctx.fillStyle = isDark ? "#34D399" : "#10B981";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("System is online.", sx + sw / 2, sy + sh / 2 + 10);
    ctx.fillText("Click button to begin.", sx + sw / 2, sy + sh / 2 + 25);
    ctx.textAlign = "left";
  };

  const drawTractor = (ctx: CanvasRenderingContext2D, x: number, y: number, isDark: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.7, 0.7);

    // Body
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-20, -10, 40, 16);

    // Cabin
    ctx.fillStyle = isDark ? "#1e293b" : "#e2e8f0";
    ctx.fillRect(-15, -24, 20, 14);

    // Wheels
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(-10, 10, 10, 0, Math.PI * 2);
    ctx.arc(12, 10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Fading text story steps
  const scenes = [
    {
      badge: "🌱 Friendly AI for Modern Farming",
      title: "The Intelligent Operating System for Modern Agriculture",
      desc: "Meet Farmer Raj! He is standing on his land looking uncertain about his next crop cycle. Scroll down to see how AgriTwin helps him!"
    },
    {
      badge: "Step 1: Creating Your Digital Twin",
      title: "Laying the Virtual Foundations",
      desc: "Farmer Raj pulls out his smartphone. Glowing 3D satellite laser grid lines sweep across the field, converting the terrain into a living 3D Digital Twin inside his app."
    },
    {
      badge: "Step 2: Soil Property & Quality Check",
      title: "Checking Soil Bio-Telemetry",
      desc: "The reasoning engine checks macronutrients (NPK), moisture levels (42%), soil acidity (pH), and local meteorology grids instantly."
    },
    {
      badge: "Step 3: Smart Farm Copilot (Do's & Don'ts)",
      title: "Actionable Plain English Rules",
      desc: "Clear, explainable guidelines show farmers exactly what tasks to run and what to avoid to maximize yields and cut irrigation costs."
    },
    {
      badge: "Step 4: Virtual Seed Planting",
      title: "Planting in the Sandbox",
      desc: "Simulate planting schedules and intercropping layouts in the virtual farm sandbox before spending money in the real-world."
    },
    {
      badge: "Step 5: Bountiful Real-World Harvest",
      title: "Real-world Maximum Yields",
      desc: "Higher profits (+25%), lower water usage (1,200L saved), and verified low-tillage carbon credit rewards (+$420 Carbon Credits)."
    },
    {
      badge: "Step 6: Ready to Begin?",
      title: "Launch AgriTwin OS",
      desc: "Ready to test your farm decisions risk-free? Click the glowing launch button inside the phone frame to unlock the sandbox!"
    }
  ];

  return (
    <section 
      ref={containerRef} 
      id="scrollytelling" 
      className="relative w-full h-screen flex flex-col justify-center overflow-hidden transition-colors duration-500 bg-[#FBF9F1] dark:bg-[#0B0F17]"
    >
      {/* Blueprint dot pattern overlays */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full w-full">
          
          {/* LEFT COLUMN (5 columns): Sticky narrative text centered */}
          <div className="col-span-1 lg:col-span-5 h-[300px] relative flex flex-col justify-center">
            {scenes.map((scene, index) => (
              <div
                key={index}
                className={`transition-all duration-700 absolute inset-0 flex flex-col justify-center items-start ${
                  currentScene === index 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
                }`}
              >
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 font-sans text-[11px] font-extrabold tracking-wider uppercase border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-farm-green shadow-sm">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>{scene.badge}</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4.5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 tracking-tight leading-tight transition-colors">
                  {scene.title}
                </h2>

                {/* Description */}
                <p className="text-slate-500 dark:text-slate-350 text-sm sm:text-base leading-relaxed font-bold transition-colors">
                  {scene.desc}
                </p>

                {/* Guide pointer */}
                {index < 6 && (
                  <div className="mt-8 flex items-center gap-2 text-xs font-extrabold text-slate-400">
                    <span>Keep scrolling to scan</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-farm-green animate-ping"></span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN (7 columns): Sticky smartphone frame enclosing the canvas */}
          <div className="col-span-1 lg:col-span-7 flex justify-center items-center h-full min-h-[500px]">
            <div className="relative w-full h-[500px] flex justify-center items-center">
              
              <div className="relative h-full w-full flex justify-center items-center">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full block" 
                />

                {/* Clickable button layer for Scene 7 */}
                {currentScene === 6 && (
                  <div className="absolute bottom-[160px] right-[25px] sm:right-[35px] lg:right-[45px] z-20 w-[140px] pointer-events-auto">
                    <button
                      onClick={() => setShowLaunchModal(true)}
                      className="w-full py-2.5 bg-farm-green hover:bg-farm-green-dark text-white font-sans text-[10px] font-extrabold rounded-full tracking-wider transition-all duration-300 shadow-farm hover:scale-105 active:scale-95 animate-bounce-slow cursor-pointer"
                    >
                      Launch OS 🚀
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Launch app modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="glass-bubble p-8 rounded-3xl border-2 border-white dark:border-slate-800 max-w-md w-full shadow-farm-lg text-center space-y-4 animate-scale-up pointer-events-auto">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-farm-green animate-float" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              Entering Virtual Twin Sandbox!
            </h3>
            <p className="text-slate-500 dark:text-slate-350 text-xs font-bold leading-relaxed">
              System is synchronizing real-time multispectral drone arrays and loading the Neo4j Knowledge Graph. Prepare for intercropping recommendations!
            </p>
            <div className="bg-[#fbf9f4] dark:bg-slate-900 p-3 rounded-2xl border border-orange-100/50 dark:border-slate-800 text-[10px] font-sans font-bold text-slate-400">
              SYS_TELEMETRY: ONLINE (v3.2.1-PROLOG)
            </div>
            <button
              onClick={() => setShowLaunchModal(false)}
              className="px-6 py-2.5 bg-farm-green hover:bg-farm-green-dark text-white font-sans text-xs font-extrabold rounded-full shadow-farm transition-all cursor-pointer"
            >
              Close Console
            </button>
          </div>
        </div>
      )}

      {/* Progress tracker */}
      <div className="absolute bottom-6 right-6 z-10 hidden lg:flex items-center gap-3 bg-white/80 dark:bg-[#0b0f17]/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 rounded-full shadow-sm text-[10px] font-sans font-bold text-slate-400 transition-colors pointer-events-none">
        <span>Story Progress</span>
        <div className="w-24 h-1.5 bg-orange-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-farm-green transition-all" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="text-slate-600 dark:text-slate-300">{Math.floor(scrollProgress * 100)}%</span>
      </div>
    </section>
  );
}
