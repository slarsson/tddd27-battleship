import { GameState } from '.';
import { Board } from './board';

export interface OutgoingMessage {
  type: string;
}

export interface StateUpdate extends OutgoingMessage {
  mode: GameState;
  board: Board;
  players: {
    p1: string;
    p2: string;
  };
}

