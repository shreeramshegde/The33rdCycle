import React, { useEffect, useRef, useState } from 'react';
import { Eye, X } from 'lucide-react';

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
  const [showFeedModal, setShowFeedModal] = useState(false);

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
    <>
      <div className="w-full bg-[#10141d]/90 border border-[#282d3b] rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] shadow-md relative z-10 backdrop-blur-md">
        {/* Left: Feed info & Live indicator (Clickable to inspect camera) */}
        <button
          onClick={() => setShowFeedModal(true)}
          className="flex items-center gap-1.5 sm:gap-2 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group text-left min-w-0"
          title="Inspect Surveillance Intercept Feed"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
          <span className="font-bold tracking-wider font-dossier text-xs group-hover:underline truncate">CAM-03 • ARCHIVE</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-mono shrink-0">
            <Eye className="w-3 h-3" /> FEED
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-[#8b92a2] hidden sm:inline font-mono">SIGNAL 99.4%</span>
        </button>

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
        <div className="flex items-center gap-2 sm:gap-3 text-[#dbd4cb] shrink-0 text-[10px] sm:text-[11px]">
          <span className="text-amber-400/90 font-semibold font-mono">REC {elapsed}</span>
          <span className="text-slate-600 hidden xs:inline">•</span>
          <span className="text-[#8b92a2] font-mono hidden xs:inline">{timeStr}</span>
        </div>
      </div>

      {/* Surveillance Camera Modal Popup */}
      {showFeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141720] border border-[#282d3b] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <div className="p-3 sm:p-4 border-b border-[#282d3b] flex items-center justify-between bg-[#10131a]">
              <div className="flex items-center gap-2 text-amber-400 font-dossier text-xs sm:text-sm font-bold tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>CAM 03 • EVIDENCE ARCHIVE VAULT</span>
              </div>
              <button
                onClick={() => setShowFeedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2432] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black overflow-hidden select-none">
              <video
                src="/archive-feed.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                poster="/archive-room.png"
                className="w-full h-full object-cover"
              />
              {/* Subtle CRT scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
            </div>
            <div className="p-3 bg-[#0d0f14] border-t border-[#282d3b] flex items-center justify-between text-xs text-[#8b92a2] font-mono">
              <span>LOCATION: NIE ARCHIVE • SECTOR 33</span>
              <span className="text-amber-400/90 font-dossier tracking-wider">INTERCEPT ACTIVE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
