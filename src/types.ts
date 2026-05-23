export type AnimationState = 'idle' | 'walking' | 'jumping' | 'spinning' | 'sitting';

export interface DogState {
  x: number;
  facing: 'left' | 'right';
  animation: AnimationState;
  speechText: string | null;
}

export type Command =
  | { type: 'move'; steps: number }
  | { type: 'left'; steps: number }
  | { type: 'jump' }
  | { type: 'spin' }
  | { type: 'say'; text: string }
  | { type: 'bark' }
  | { type: 'sit' }
  | { type: 'wait'; ms: number };
