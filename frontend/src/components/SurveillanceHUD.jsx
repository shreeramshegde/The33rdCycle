import React, { useEffect, useRef, useState } from 'react';

export default function SurveillanceHUD() {
  const canvasRef = useRef(null);
  const [timeStr, setTimeStr] = useState('');
  const [elapsed, setElapsed] = useState('00:00:00');

  // Live UTC Clock & Session Elapsed Timer
  useEffect(() => {
    const startTimestamp = Date.now();
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');

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

  // Ambient Dust Motes Canvas (Noir Cinematic Archive Room Effect)
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

    // Create 35 drifting subtle dust motes
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: Math.random() * -0.4 - 0.1, // float upward softly
      alpha: Math.random() * 0.45 + 0.15,
      fadeSpeed: Math.random() * 0.008 + 0.003,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Fade pulse
        p.alpha += p.fadeSpeed * p.fadeDir;
        if (p.alpha > 0.6) {
          p.alpha = 0.6;
          p.fadeDir = -1;
        } else if (p.alpha < 0.1) {
          p.alpha = 0.1;
          p.fadeDir = 1;
        }

        // Wrap around boundaries
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(219, 212, 203, ${p.alpha})`; // warm parchment dust
        ctx.fill();
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
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
      {/* Ambient Canvas for Floating Dust Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Subtle CRT Scanline Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(13,15,20,0.85)_100%)] pointer-events-none" />

      {/* Surveillance HUD Viewfinder Corners */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-amber-500/40 text-xs font-mono">
        ⌜ CAM_03 [LIVE]
      </div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-amber-500/40 text-xs font-mono">
        {timeStr} ⌝
      </div>
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-amber-500/30 text-[10px] sm:text-xs font-mono">
        ⌞ NISB ARCHIVE FILE #33
      </div>
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-amber-500/30 text-[10px] sm:text-xs font-mono">
        REC {elapsed} ⌟
      </div>

      {/* Live Audio Telemetry Waveform Graphic */}
      <div className="hidden lg:flex items-center gap-1.5 absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#141720]/80 border border-[#282d3b] text-[10px] font-mono text-amber-400/80">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="tracking-widest">INTERCEPTED FREQ: 1420.405 MHz</span>
        <div className="flex items-end gap-0.5 h-3 ml-2">
          <span className="w-0.5 h-2 bg-amber-400 animate-[pulse_1s_infinite_100ms]" />
          <span className="w-0.5 h-3 bg-amber-400 animate-[pulse_1s_infinite_300ms]" />
          <span className="w-0.5 h-1.5 bg-amber-400 animate-[pulse_1s_infinite_200ms]" />
          <span className="w-0.5 h-2.5 bg-amber-400 animate-[pulse_1s_infinite_400ms]" />
          <span className="w-0.5 h-1 bg-amber-400 animate-[pulse_1s_infinite_150ms]" />
        </div>
      </div>
    </div>
  );
}
