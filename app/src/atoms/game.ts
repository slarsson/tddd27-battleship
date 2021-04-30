import { atom, selector } from "recoil";
import { GameState as GlobalGameState } from "../../../interfaces/index";

/* Global state store "gameId" and "token"  */
interface GameState {
  gameId: string;
  token: string;
}

/* Test */
interface CurrentGame {
  alive: boolean;
  gameId: string;
  token: string;
  view: GlobalGameState;
  myGrid: number[];
  enemyGrid: number[];
  yourTurn: boolean;
}

interface GameStates {
  [key: string]: GameState;
}

/* Test */
export const currentGameState = atom<CurrentGame>({
  key: "currentGame",
  default: {
    alive: false,
    gameId: '',
    token: '',
    view: GlobalGameState.PlaceBoats,
    myGrid: new Array(100).fill(0),
    enemyGrid: new Array(100).fill(0),
    yourTurn: false
  }
});

export const gameStates = atom<GameStates>({
  key: "gameStates",
  default: {}
});

export const sendActionState = atom<() => any>({
  key: 'sendActionState',
  default: () => { }
});