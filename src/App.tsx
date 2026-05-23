import { useCallback, useRef, useState } from 'react';
import { DogWorld } from './components/DogWorld';
import { CodePanel } from './components/CodePanel';
import { CommandCheatSheet } from './components/CommandCheatSheet';
import { ChallengeCard, AllDoneCard } from './components/ChallengeCard';
import { SuccessOverlay } from './components/SuccessOverlay';
import { useCommandRunner } from './hooks/useCommandRunner';
import { CHALLENGES } from './data/challenges';
import type { Command } from './types';
import type { RunContext } from './hooks/useCommandRunner';
import './App.css';

export default function App() {
  const { dogState, log, isRunning, error, context, runCode, celebrate, stop, reset } =
    useCommandRunner();

  const worldWidthRef = useRef(600);
  const handleWidthChange = useCallback((w: number) => { worldWidthRef.current = w; }, []);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [failFlash, setFailFlash] = useState(false);
  const allDone = challengeIndex >= CHALLENGES.length;
  const currentChallenge = allDone ? null : CHALLENGES[challengeIndex];

  const handleRunDone = useCallback(
    (commands: Command[], ctx: RunContext) => {
      if (!currentChallenge) return;
      if (currentChallenge.validate(commands, ctx)) {
        setCompletedCount(n => n + 1);
        celebrate().then(() => setShowSuccess(true));
      } else {
        setFailFlash(true);
        setTimeout(() => setFailFlash(false), 600);
      }
    },
    [currentChallenge, celebrate]
  );

  const handleRun = useCallback(
    (code: string) => runCode(code, worldWidthRef.current, handleRunDone),
    [runCode, handleRunDone]
  );

  const handleNext = useCallback(() => {
    setShowSuccess(false);
    if (challengeIndex >= CHALLENGES.length - 1) {
      setChallengeIndex(CHALLENGES.length); // all done
    } else {
      setChallengeIndex(i => i + 1);
    }
  }, [challengeIndex]);

  const handleReset = useCallback(() => {
    reset();
    setChallengeIndex(0);
    setCompletedCount(0);
    setShowSuccess(false);
  }, [reset]);

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">🐾</span>
        <h1>CodePet</h1>
        <span className="tagline">Teach your dog with code!</span>
        {completedCount > 0 && (
          <span className="header-stars">{'⭐'.repeat(completedCount)}</span>
        )}
      </header>

      <main className="app-main">
        <aside className="left-panel">
          {allDone ? (
            <AllDoneCard />
          ) : (
            <ChallengeCard
              challenge={currentChallenge!}
              index={challengeIndex}
              total={CHALLENGES.length}
              completedCount={completedCount}
            />
          )}

          <CodePanel
            isRunning={isRunning}
            log={log}
            error={error}
            failFlash={failFlash}
            onRun={handleRun}
            onStop={stop}
            onReset={handleReset}
          />

          <CommandCheatSheet />
        </aside>

        <section className="right-panel">
          <DogWorld
            dogState={dogState}
            context={context}
            onWidthChange={handleWidthChange}
          />
        </section>
      </main>

      {showSuccess && currentChallenge && (
        <SuccessOverlay
          challenge={currentChallenge}
          challengeNum={completedCount}
          totalChallenges={CHALLENGES.length}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
