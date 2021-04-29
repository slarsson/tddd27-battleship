import { GameState } from '.';

export interface OutgoingMessage {
  type: string;
}

export interface StateUpdate extends OutgoingMessage {
  gameState: GameState;
  names: string[];
  yourTurn: boolean;
  boards: number[][];
}

