import React, { useEffect, useRef, useState } from 'react';

export default function SurveillanceHUD() {
  const canvasRef = useRef(null);

  // Cinematic Noir Dust Particles & Flashlight Sweeping Beam Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 80 High-energy atmospheric particles (amber embers & parchment dust)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.8,
      vx: (Math.random() - 0.5) * 0.6,
      vy: Math.random() * -0.7 - 0.2, // drifting upward like warm embers
      alpha: Math.random() * 0.7 + 0.2,
      fadeSpeed: Math.random() * 0.012 + 0.005,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
      isEmber: Math.random() > 0.65, // 35% are glowing amber embers
    }));

    let beamAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric flashlight sweep
      beamAngle += 0.003;
      const beamX = width * 0.5 + Math.cos(beamAngle) * (width * 0.4);
      const beamY = height * 0.4 + Math.sin(beamAngle * 0.7) * (height * 0.25);
      const grad = ctx.createRadialGradient(beamX, beamY, 20, beamX, beamY, width * 0.65);
      grad.addColorStop(0, 'rgba(217, 119, 6, 0.04)'); // soft warm spotlight
      grad.addColorStop(0.5, 'rgba(180, 83, 9, 0.015)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render 80 particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Fade pulse
        p.alpha += p.fadeSpeed * p.fadeDir;
        if (p.alpha > 0.85) {
          p.alpha = 0.85;
          p.fadeDir = -1;
        } else if (p.alpha < 0.15) {
          p.alpha = 0.15;
          p.fadeDir = 1;
        }

        // Boundary wrap
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isEmber) {
          ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`; // glowing amber
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(219, 212, 203, ${p.alpha})`; // aged parchment
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* High-Power Ambient Canvas for Floating Dust & Embers */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(13,15,20,0.92)_100%)] pointer-events-none" />
    </div>
  );
}

// Separate Non-Overlapping Surveillance Bar component placed cleanly in layout flow
export function SurveillanceBar() {
  const [timeStr, setTimeStr] = useState('');
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const startTimestamp = Date.now();
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(11, 19) + ' UTC');

      const diffSec = Math.floor((Date.now() - startTimestamp) / 1000);
      const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSec % 60).padStart(2, '0');
      setElapsed(`${hrs}:${mins}:${secs}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#10141d]/90 border border-[#282d3b] rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] shadow-md relative z-10 backdrop-blur-md">
      {/* Left: Feed info & Live indicator */}
      <div className="flex items-center gap-2 text-amber-400">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span className="font-bold tracking-wider font-dossier text-xs">CAM-03 • NIE EVIDENCE ARCHIVE</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-[#8b92a2] hidden sm:inline font-mono">SIGNAL 99.4%</span>
      </div>

      {/* Center: Live Waveform Visualizer */}
      <div className="hidden md:flex items-center gap-2 text-[#8b92a2]">
        <span className="text-[10px]">FREQ: 1420.4 MHz</span>
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 h-2 bg-amber-400 animate-[pulse_1s_infinite_100ms]" />
          <span className="w-0.5 h-3 bg-amber-400 animate-[pulse_1s_infinite_300ms]" />
          <span className="w-0.5 h-1.5 bg-amber-400 animate-[pulse_1s_infinite_200ms]" />
          <span className="w-0.5 h-2.5 bg-amber-400 animate-[pulse_1s_infinite_400ms]" />
          <span className="w-0.5 h-1 bg-amber-400 animate-[pulse_1s_infinite_150ms]" />
        </div>
      </div>

      {/* Right: Elapsed Stopwatch & UTC clock */}
      <div className="flex items-center gap-3 text-[#dbd4cb]">
        <span className="text-amber-400/90 font-semibold">REC {elapsed}</span>
        <span className="text-slate-600">•</span>
        <span className="text-[#8b92a2]">{timeStr}</span>
      </div>
    </div>
  );
}
