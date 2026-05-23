import { useEffect } from 'react';
import { Confetti } from './Confetti';
import type { Challenge } from '../data/challenges';

interface Props {
  challenge: Challenge;
  challengeNum: number;
  totalChallenges: number;
  onNext: () => void;
}

export function SuccessOverlay({ challenge, challengeNum, totalChallenges, onNext }: Props) {
  const isLast = challengeNum === totalChallenges;

  useEffect(() => {
    const timer = setTimeout(onNext, 6000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="success-overlay" onClick={onNext}>
      <Confetti />
      <div className="success-card" onClick={e => e.stopPropagation()}>
        <div className="success-big-emoji">{isLast ? '🏆' : '🎉'}</div>
        <h2 className="success-title">
          {isLast ? 'You finished them all!' : 'Challenge Complete!'}
        </h2>
        <div className="success-challenge-name">
          {challenge.emoji} {challenge.title}
        </div>
        <div className="success-stars">⭐ ⭐ ⭐</div>
        <div className="success-progress">
          {challengeNum} / {totalChallenges} done
        </div>
        <button className="btn btn-next" onClick={onNext}>
          {isLast ? '🎊 Play Again' : '➡️ Next Challenge'}
        </button>
        <div className="success-skip">Click anywhere to continue</div>
      </div>
    </div>
  );
}
