import { useState } from 'react';
import type { Challenge } from '../data/challenges';

const CATEGORY_LABEL: Record<Challenge['category'], string> = {
  basics: '🐾 Basics',
  loops: '🔁 Loops',
  conditionals: '🤔 If / Else',
};

interface Props {
  challenge: Challenge;
  index: number;
  total: number;
  completedCount: number;
}

export function ChallengeCard({ challenge, index, total, completedCount }: Props) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="challenge-card">
      <div className="challenge-card-header">
        <span className="challenge-num">🎯 Challenge {index + 1} / {total}</span>
        <span className="challenge-category">{CATEGORY_LABEL[challenge.category]}</span>
      </div>

      <div className="challenge-progress-dots">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`challenge-dot ${i < completedCount ? 'done' : i === index ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="challenge-title-row">
        <span className="challenge-emoji">{challenge.emoji}</span>
        <span className="challenge-title">{challenge.title}</span>
      </div>

      <p className="challenge-desc">{challenge.description}</p>

      <button
        className="hint-btn"
        onClick={() => setShowHint(h => !h)}
      >
        {showHint ? '🙈 Hide hint' : '💡 Show hint'}
      </button>

      {showHint && (
        <pre className="challenge-hint">{challenge.hint}</pre>
      )}
    </div>
  );
}

export function AllDoneCard() {
  return (
    <div className="challenge-card challenge-all-done">
      <div className="challenge-all-done-inner">
        <div>🏆</div>
        <strong>All challenges complete!</strong>
        <p>You're a CodePet master!</p>
      </div>
    </div>
  );
}
