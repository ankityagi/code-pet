import { useRef, useEffect } from 'react';
import type { DogState } from '../types';
import type { RunContext } from '../hooks/useCommandRunner';

const MOOD_EMOJI: Record<string, string> = {
  happy: '😊',
  sleepy: '😴',
  excited: '🤩',
  silly: '🤪',
};

interface Props {
  dogState: DogState;
  context: RunContext;
  onWidthChange: (w: number) => void;
}

export function DogWorld({ dogState, context, onWidthChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) onWidthChange(entry.contentRect.width);
    });
    observer.observe(el);
    onWidthChange(el.clientWidth);
    return () => observer.disconnect();
  }, [onWidthChange]);

  const energyStars = '⭐'.repeat(context.energy) + '☆'.repeat(5 - context.energy);

  return (
    <div className="dog-world-wrapper">
      <div className="context-bar">
        <span className="context-item">
          <span className="context-label">mood</span>
          <span className="context-value">
            {MOOD_EMOJI[context.mood]} <code>"{context.mood}"</code>
          </span>
        </span>
        <span className="context-divider" />
        <span className="context-item">
          <span className="context-label">energy</span>
          <span className="context-value">
            <code>{context.energy}</code> {energyStars}
          </span>
        </span>
        <span className="context-hint">← try these in if/else!</span>
      </div>

      <div ref={containerRef} className="dog-world">
        <div className="sky">
          <span className="decoration sun">☀️</span>
          <span className="decoration cloud cloud-1">☁️</span>
          <span className="decoration cloud cloud-2">☁️</span>
        </div>

        <div
          className="dog-position"
          style={{ left: `${dogState.x}px`, transition: 'left 0.45s ease' }}
        >
          {dogState.speechText && (
            <div className="speech-bubble">{dogState.speechText}</div>
          )}
          <div
            className={`dog dog--${dogState.animation}`}
            style={{ transform: dogState.facing === 'left' ? 'scaleX(-1)' : undefined }}
          >
            🐕
          </div>
        </div>

        <div className="ground">
          <div className="ground-strip" />
        </div>
      </div>
    </div>
  );
}
