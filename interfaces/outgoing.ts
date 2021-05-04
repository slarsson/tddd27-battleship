import { GameState } from '.';

export interface OutgoingMessage {
  type: string;
}

export interface StateUpdate extends OutgoingMessage {
  gameState: GameState;
  myName: string;
  enemyName: string;
  yourTurn: boolean;
  boards: number[][];
  boats: number[];
}
