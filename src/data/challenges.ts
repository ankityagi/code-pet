import type { Command } from '../types';
import type { RunContext } from '../hooks/useCommandRunner';

export interface Challenge {
  id: number;
  emoji: string;
  title: string;
  description: string;
  hint: string;
  category: 'basics' | 'loops' | 'conditionals';
  validate: (commands: Command[], context: RunContext) => boolean;
}

function countType(commands: Command[], type: Command['type']): number {
  return commands.filter(c => c.type === type).length;
}

function totalMoveSteps(commands: Command[]): number {
  return commands
    .filter((c): c is Extract<Command, { type: 'move' }> => c.type === 'move')
    .reduce((sum, c) => sum + c.steps, 0);
}

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    emoji: '🦘',
    title: 'First Jump!',
    category: 'basics',
    description: 'Make the dog jump at least once.',
    hint: 'jump()',
    validate: cmds => countType(cmds, 'jump') >= 1,
  },
  {
    id: 2,
    emoji: '💬',
    title: 'Say Something!',
    category: 'basics',
    description: 'Make the dog say any message using say().',
    hint: 'say("Hello!")',
    validate: cmds => countType(cmds, 'say') >= 1,
  },
  {
    id: 3,
    emoji: '🚶',
    title: 'Go for a Walk',
    category: 'basics',
    description: 'Walk the dog at least 4 steps to the right.',
    hint: 'move(4)',
    validate: cmds => totalMoveSteps(cmds) >= 4,
  },
  {
    id: 4,
    emoji: '🔁',
    title: 'Jump 3 Times!',
    category: 'loops',
    description: 'Make the dog jump at least 3 times. Try using repeat() or a for loop!',
    hint: `repeat(3, () => {
  jump()
})`,
    validate: cmds => countType(cmds, 'jump') >= 3,
  },
  {
    id: 5,
    emoji: '💃',
    title: 'Dance Party',
    category: 'loops',
    description: 'Make the dog jump, spin, AND bark — all in one run!',
    hint: `repeat(2, () => {
  jump()
  spin()
})
bark()`,
    validate: cmds =>
      countType(cmds, 'jump') >= 1 &&
      countType(cmds, 'spin') >= 1 &&
      countType(cmds, 'bark') >= 1,
  },
  {
    id: 6,
    emoji: '🔀',
    title: 'There and Back',
    category: 'loops',
    description: 'Walk the dog right, then bring it back left.',
    hint: `move(3)
left(3)`,
    validate: cmds =>
      countType(cmds, 'move') >= 1 && countType(cmds, 'left') >= 1,
  },
  {
    id: 7,
    emoji: '⚡',
    title: 'Energy Check',
    category: 'conditionals',
    description:
      'If energy is more than 3, make the dog jump! Otherwise make it sit. Check the energy bar above the dog.',
    hint: `if (energy > 3) {
  jump()
} else {
  sit()
}`,
    validate: (cmds, ctx) =>
      ctx.energy > 3
        ? countType(cmds, 'jump') >= 1
        : countType(cmds, 'sit') >= 1,
  },
  {
    id: 8,
    emoji: '🎭',
    title: 'Mood Master',
    category: 'conditionals',
    description:
      'React to the dog\'s mood! happy→bark, sleepy→sit, excited→spin, silly→move and say something.',
    hint: `if (mood === "happy") {
  bark()
} else if (mood === "sleepy") {
  sit()
} else if (mood === "excited") {
  spin()
} else {
  move(1)
  say("Silly!")
}`,
    validate: (cmds, ctx) => {
      if (ctx.mood === 'happy') return countType(cmds, 'bark') >= 1;
      if (ctx.mood === 'sleepy') return countType(cmds, 'sit') >= 1;
      if (ctx.mood === 'excited') return countType(cmds, 'spin') >= 1;
      // silly
      return countType(cmds, 'move') >= 1 && countType(cmds, 'say') >= 1;
    },
  },
];
