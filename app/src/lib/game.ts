import { GameState } from '../../../interfaces';
import { CurrentGame } from '../atoms/game';

export const newGame = (gameId: string, token: string): CurrentGame => {
  return {
    alive: true,
    gameId: gameId,
    token: token,
    view: GameState.Loading,
    boats: [],
    myGrid: new Array(100).fill(0),
    enemyGrid: new Array(100).fill(0),
    yourTurn: false,
    myName: '',
    myScore: 0,
    enemyName: '',
    enemyScore: 0,
  };
};
