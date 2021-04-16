import { Board } from './board';

export interface OutgoingMessage {
  type: string;
}

export interface GameState extends OutgoingMessage {
  board: Board
}