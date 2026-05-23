import { useEffect, useRef } from 'react';

const COLORS = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#06b6d4', '#f97316'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  shape: 'rect' | 'circle';
}

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -30 - Math.random() * 150,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 7 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.25,
      shape: Math.random() < 0.6 ? 'rect' : 'circle',
    }));

    const startTime = Date.now();
    let frame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 5000) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = elapsed > 3500 ? Math.max(0, 1 - (elapsed - 3500) / 1500) : 1;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = 2 + Math.random() * 3;
          p.vx = (Math.random() - 0.5) * 5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
