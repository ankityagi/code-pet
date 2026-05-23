const SECTIONS = [
  {
    title: '🐾 Actions',
    items: [
      { cmd: 'move(3)', desc: 'Walk right 3 steps' },
      { cmd: 'left(2)', desc: 'Walk left 2 steps' },
      { cmd: 'jump()', desc: 'Jump up!' },
      { cmd: 'spin()', desc: 'Spin around' },
      { cmd: 'bark()', desc: 'Say woof!' },
      { cmd: 'say("hi")', desc: 'Show speech bubble' },
      { cmd: 'sit()', desc: 'Sit down' },
      { cmd: 'wait(1000)', desc: 'Wait 1 second' },
    ],
  },
  {
    title: '🔁 Loops',
    items: [
      { cmd: 'repeat(4, () => { jump() })', desc: 'Jump 4 times' },
      { cmd: 'for (let i = 0; i < 3; i++) { bark() }', desc: 'Bark 3 times' },
      { cmd: 'for (let i = 1; i <= energy; i++) { move(1) }', desc: 'Move using energy' },
    ],
  },
  {
    title: '🤔 Conditionals',
    items: [
      { cmd: 'if (mood === "happy") { bark() }', desc: 'Do something if happy' },
      { cmd: 'if (flip()) { jump() } else { sit() }', desc: 'Random true/false' },
      { cmd: 'if (energy > 3) { spin() }', desc: 'Check energy level' },
      { cmd: 'if (random(6) === 1) { say("Lucky!") }', desc: 'Roll a dice (1–6)' },
    ],
  },
];

export function CommandCheatSheet() {
  return (
    <div className="cheat-sheet">
      {SECTIONS.map(section => (
        <div key={section.title}>
          <div className="cheat-header">{section.title}</div>
          <div className="cheat-list">
            {section.items.map(({ cmd, desc }) => (
              <div key={cmd} className="cheat-row">
                <code className="cheat-cmd">{cmd}</code>
                <span className="cheat-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
