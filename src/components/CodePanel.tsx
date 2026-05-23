import { useState } from 'react';

const EXAMPLES: Record<string, { label: string; code: string }> = {
  basic: {
    label: '🐾 Basic',
    code: `// Tell the dog what to do!
bark()
move(2)
say("Hello world!")
jump()
spin()
`,
  },
  loops: {
    label: '🔁 Loops',
    code: `// repeat() runs something many times
repeat(3, () => {
  jump()
  bark()
})

// for loops work too!
for (let i = 1; i <= energy; i++) {
  move(1)
}

say("Done!")
`,
  },
  ifelse: {
    label: '🤔 If / Else',
    code: `// mood and energy change every run — try it!
if (mood === "happy") {
  bark()
  jump()
  say("Yay!")
} else if (mood === "excited") {
  spin()
  spin()
  bark()
} else if (mood === "silly") {
  move(2)
  sit()
  say("Boop!")
} else {
  say("zzz...")
  sit()
}
`,
  },
};

interface Props {
  isRunning: boolean;
  log: string[];
  error: string | null;
  failFlash: boolean;
  onRun: (code: string) => void;
  onStop: () => void;
  onReset: () => void;
}

export function CodePanel({ isRunning, log, error, failFlash, onRun, onStop, onReset }: Props) {
  const [code, setCode] = useState(EXAMPLES.basic.code);
  const [activeExample, setActiveExample] = useState('basic');

  const loadExample = (key: string) => {
    setCode(EXAMPLES[key].code);
    setActiveExample(key);
  };

  return (
    <div className="code-panel">
      <div className="example-tabs">
        {Object.entries(EXAMPLES).map(([key, ex]) => (
          <button
            key={key}
            className={`example-tab ${activeExample === key ? 'active' : ''}`}
            onClick={() => loadExample(key)}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className={`editor-section ${failFlash ? 'fail-flash' : ''}`}>
        <textarea
          className="code-editor"
          value={code}
          onChange={e => {
            setCode(e.target.value);
            setActiveExample('');
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      <div className="button-row">
        <button
          className={`btn btn-run ${isRunning ? 'btn-stop' : ''}`}
          onClick={() => (isRunning ? onStop() : onRun(code))}
        >
          {isRunning ? '⏹ Stop' : '▶ Run'}
        </button>
        <button className="btn btn-reset" onClick={onReset} disabled={isRunning}>
          🔄 Reset
        </button>
      </div>

      <div className="log-section">
        <div className="log-header">📋 What happened</div>
        <div className="log-body">
          {log.length === 0 && !error && (
            <div className="log-empty">Press ▶ Run to see your dog move!</div>
          )}
          {error && <div className="log-error">❌ Oops! {error}</div>}
          {log.map((line, i) => (
            <div key={i} className="log-line">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
