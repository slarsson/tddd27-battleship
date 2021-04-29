import { TileState, Board, GameState } from '../../../interfaces';

// export enum GameStates {
//   WaitingForPlayers,
//   Playing,
//   GameHasEnded,
// }

export interface GameBoard extends Board {
  dimension: number;
}

export interface State {
  mode: GameState;
  p1Board: GameBoard;
  p2Board: GameBoard;
}