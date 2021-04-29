import { atom, selector } from "recoil";

/* Global state store "gameId" and "token"  */
interface GameState {
    gameId: string;
    token: string;
}

/* Test */
interface CurrentGame {
  gameId: string
  token: string;
}

interface GameStates {
    [key: string]: GameState;
}

/* Test */
export const currentGameState = atom<CurrentGame | null>({
  key: "currentGame",
  default: null
});

export const gameStates = atom<GameStates>({
  key: "gameStates",
  default: {}
});