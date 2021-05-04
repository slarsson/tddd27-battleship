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
  boats: number[];
  myName: string;
  enemyName: string;
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
    view: GlobalGameState.Loading,
    myGrid: new Array(100).fill(-1),
    enemyGrid: new Array(100).fill(-1),
    yourTurn: false,
    boats: [],
    myName: '',
    enemyName: ''
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