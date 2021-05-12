import { GameState } from '.';

export interface OutgoingMessage {
  type: string;
}

export interface StateUpdate extends OutgoingMessage {
  gameState: GameState;
  myName: string;
  myScore: number;
  enemyName: string;
  enemyScore: number;
  yourTurn: boolean;
  boards: number[][];
  boats: number[];
  done: boolean;
}
