import { atom, selector } from "recoil";

/* Global state store "gameId" and "token"  */
interface GameState {
    gameId: string;
    token?: string;
}

interface GameStates {
    [key: string]: GameState;
}

export const gameStates = atom<GameStates>({
  key: "gameStates",
  default: {}
});