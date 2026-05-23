import { useState, useCallback, useRef } from 'react';
import type { Command, DogState } from '../types';

const TILE_SIZE = 60;
const DOG_WIDTH = 70;
const INITIAL_X = 80;
const MAX_COMMANDS = 100;

const MOODS = ['happy', 'sleepy', 'excited', 'silly'] as const;
export type Mood = (typeof MOODS)[number];

export interface RunContext {
  mood: Mood;
  energy: number;
}

const INITIAL_STATE: DogState = {
  x: INITIAL_X,
  facing: 'right',
  animation: 'idle',
  speechText: null,
};

function pickContext(): RunContext {
  return {
    mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    energy: Math.floor(Math.random() * 5) + 1,
  };
}

export function useCommandRunner() {
  const [dogState, setDogState] = useState<DogState>(INITIAL_STATE);
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<RunContext>(pickContext);
  const worldWidthRef = useRef(600);
  const stopRef = useRef(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const sleep = (ms: number) =>
    new Promise<void>(resolve => {
      const id = setTimeout(resolve, ms);
      const check = setInterval(() => {
        if (stopRef.current) {
          clearTimeout(id);
          clearInterval(check);
          resolve();
        }
      }, 50);
      setTimeout(() => clearInterval(check), ms + 100);
    });

  const executeCommands = useCallback(async (commands: Command[]) => {
    setIsRunning(true);
    setError(null);
    setLog([]);
    stopRef.current = false;

    for (const cmd of commands) {
      if (stopRef.current) break;

      switch (cmd.type) {
        case 'move': {
          const steps = Math.max(1, Math.min(cmd.steps, 10));
          const dist = steps * TILE_SIZE;
          setDogState(prev => ({
            ...prev,
            x: Math.min(prev.x + dist, worldWidthRef.current - DOG_WIDTH - 20),
            facing: 'right',
            animation: 'walking',
          }));
          addLog(`🐕 Moved right ${steps} step${steps !== 1 ? 's' : ''}`);
          await sleep(400 + steps * 120);
          setDogState(prev => ({ ...prev, animation: 'idle' }));
          await sleep(100);
          break;
        }
        case 'left': {
          const steps = Math.max(1, Math.min(cmd.steps, 10));
          const dist = steps * TILE_SIZE;
          setDogState(prev => ({
            ...prev,
            x: Math.max(prev.x - dist, 20),
            facing: 'left',
            animation: 'walking',
          }));
          addLog(`🐕 Moved left ${steps} step${steps !== 1 ? 's' : ''}`);
          await sleep(400 + steps * 120);
          setDogState(prev => ({ ...prev, animation: 'idle' }));
          await sleep(100);
          break;
        }
        case 'jump': {
          setDogState(prev => ({ ...prev, animation: 'jumping' }));
          addLog(`🐕 Jumped!`);
          await sleep(750);
          setDogState(prev => ({ ...prev, animation: 'idle' }));
          await sleep(100);
          break;
        }
        case 'spin': {
          setDogState(prev => ({ ...prev, animation: 'spinning' }));
          addLog(`🐕 Spun around! 🌀`);
          await sleep(850);
          setDogState(prev => ({ ...prev, animation: 'idle' }));
          await sleep(100);
          break;
        }
        case 'say': {
          const text = String(cmd.text).slice(0, 60);
          setDogState(prev => ({ ...prev, speechText: text, animation: 'idle' }));
          addLog(`🗨️ Dog says: "${text}"`);
          await sleep(1800 + text.length * 40);
          setDogState(prev => ({ ...prev, speechText: null }));
          await sleep(200);
          break;
        }
        case 'bark': {
          setDogState(prev => ({ ...prev, speechText: 'Woof! 🐾', animation: 'idle' }));
          addLog(`🗨️ Dog barked!`);
          await sleep(1500);
          setDogState(prev => ({ ...prev, speechText: null }));
          await sleep(200);
          break;
        }
        case 'sit': {
          setDogState(prev => ({ ...prev, animation: 'sitting' }));
          addLog(`🐕 Sat down`);
          await sleep(1000);
          setDogState(prev => ({ ...prev, animation: 'idle' }));
          await sleep(100);
          break;
        }
        case 'wait': {
          const ms = Math.max(100, Math.min(cmd.ms, 3000));
          addLog(`⏱️ Waiting ${ms / 1000}s…`);
          await sleep(ms);
          break;
        }
      }
    }

    setIsRunning(false);
    // Roll new mood/energy for next run
    setContext(pickContext());
  }, []);

  const celebrate = useCallback(async () => {
    if (isRunning) return;
    const celebCmds: Command[] = [
      { type: 'jump' },
      { type: 'spin' },
      { type: 'say', text: 'I did it! 🎉' },
      { type: 'jump' },
    ];
    await executeCommands(celebCmds);
  }, [isRunning, executeCommands]);

  const showError = useCallback((msg: string) => setError(msg), []);

  const runCode = useCallback(
    (
      code: string,
      worldWidth: number,
      onDone?: (commands: Command[], ctx: RunContext, code: string) => void
    ) => {
      if (isRunning) return;
      worldWidthRef.current = worldWidth;

      const commands: Command[] = [];

      const pushCmd = (cmd: Command) => {
        if (commands.length < MAX_COMMANDS) commands.push(cmd);
      };

      const api = {
        // Actions
        move: (steps = 1) => pushCmd({ type: 'move', steps: Math.floor(Number(steps)) }),
        left: (steps = 1) => pushCmd({ type: 'left', steps: Math.floor(Number(steps)) }),
        jump: () => pushCmd({ type: 'jump' }),
        spin: () => pushCmd({ type: 'spin' }),
        say: (text: string) => pushCmd({ type: 'say', text: String(text) }),
        bark: () => pushCmd({ type: 'bark' }),
        sit: () => pushCmd({ type: 'sit' }),
        wait: (ms = 500) => pushCmd({ type: 'wait', ms: Math.floor(Number(ms)) }),

        // Loop helper
        repeat: (times: number, fn: () => void) => {
          const n = Math.min(Math.floor(Number(times)), 20);
          for (let i = 0; i < n; i++) fn();
        },

        // Conditionals helpers
        random: (n = 6) => Math.floor(Math.random() * Math.floor(Number(n))) + 1,
        flip: () => Math.random() < 0.5,

        // Context variables — rolled fresh each run
        mood: context.mood,
        energy: context.energy,
      };

      const snap = context; // capture before async

      try {
        const fn = new Function(...Object.keys(api), code);
        fn(...Object.values(api));

        if (commands.length === 0) {
          addLog('🤔 No commands ran. Check your code!');
          return;
        }
        if (commands.length >= MAX_COMMANDS) {
          addLog(`⚠️ Too many commands! Only the first ${MAX_COMMANDS} will run.`);
        }

        executeCommands(commands).then(() => onDone?.(commands, snap, code));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setLog([`❌ Oops! ${msg}`]);
      }
    },
    [isRunning, context, executeCommands]
  );

  const stop = useCallback(() => {
    stopRef.current = true;
  }, []);

  const reset = useCallback(() => {
    stopRef.current = true;
    setTimeout(() => {
      setDogState(INITIAL_STATE);
      setLog([]);
      setError(null);
      setIsRunning(false);
      setContext(pickContext());
    }, 100);
  }, []);

  return { dogState, log, isRunning, error, context, runCode, celebrate, stop, reset, showError };
}
