import { MessageType, TileState, GameState, StateUpdate } from '../../interfaces';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';

interface Connection {
  [key: string]: WebSocket;
}

interface Tokens {
  p1: string;
  p2: string;
}

interface State {
  gameState: GameState;
  names: string[];
  turn: number;
  boats: number[];
  boatsPlaced: boolean[];
  boards: number[][][];
}

const defaultGrid = (size: number, state: TileState): number[] => {
  return new Array(size * size).fill(state);
};

class Battleship {
  private activated: boolean = false;
  private id: string;
  private connections: (WebSocket | null)[] = [null, null];
  private p1: string;
  private p2: string;
  private state: State;

  constructor(id: string) {
    this.id = id;
    this.p1 = uuidv4();
    this.p2 = uuidv4();
    this.state = {
      gameState: GameState.WaitingForPlayers,
      names: ['', ''],
      turn: 0,
      boats: [2, 3, 3, 4, 5],
      boatsPlaced: [false, false],
      boards: [
        [defaultGrid(10, TileState.Empty), defaultGrid(10, TileState.Available)],
        [defaultGrid(10, TileState.Empty), defaultGrid(10, TileState.Available)],
      ],
    };
  }

  public getTokens(): Tokens {
    return {
      p1: this.p1,
      p2: this.p2,
    };
  }

  public isActivated(): boolean {
    return this.activated;
  }

  public activate() {
    this.activated = true;
  }

  public setName(token: string, name: string) {
    if (token != this.p1 && token != this.p2) return;

    let index: number = 0;
    if (token == this.p2) {
      index = 1;
    }

    this.state.names[index] = name;
    return true;
  }

  public addConnection(token: string, ws: WebSocket) {
    let player: number;
    if (token == this.p1) {
      player = 0;
    } else if (token == this.p2) {
      player = 1;
    } else {
      return;
    }
    this.connections[player] = ws;

    // Both connected
    if (this.connections[0] !== null && this.connections[1] !== null) {
      if (this.state.gameState != GameState.WaitingForPlayers) return;
      this.state.gameState = GameState.PlaceBoats;
    }

    if (this.connections[0] !== null) {
      this.sendStateUpdate(0);
    }

    if (this.connections[1] !== null) {
      this.sendStateUpdate(1);
    }
  }

  private broadcast(player: number, msg: any, all: boolean = false) {
    console.log('???', msg);

    for (let i = 0; i < this.connections.length; i++) {
      if (all || i === player) {
        // HANDLE ERRORS
        this.connections[i]?.send(JSON.stringify(msg));
      }
    }
  }

  public handler(msg: any) {
    let player: number;
    if (msg.token == this.p1) {
      player = 0;
    } else if (msg.token == this.p2) {
      player = 1;
    } else {
      return;
    }

    switch (msg.type) {
      case MessageType.Status:
        this.sendStateUpdate(player);
        break;

      case MessageType.SetBoats:
        console.log('place stuff ok');

        if (this.state.gameState != GameState.PlaceBoats) return;

        // TODO: check
        this.state.boards[player][0] = msg.grid;
        this.state.boatsPlaced[player] = true;

        if (this.state.boatsPlaced[player == 0 ? 1 : 0]) {
          this.state.gameState = GameState.ShootBoats;
        }

        this.sendStateUpdate(0);
        this.sendStateUpdate(1);
        break;

      case MessageType.Shoot:
        if (msg.index > 100) return;
        this.shoot(player, msg.index);
        break;

      default:
        break;
    }
  }

  private shoot(player: number, index: number) {
    if (this.state.turn != player) return;
    console.log(this.state.turn, player);

    if (this.state.gameState != GameState.ShootBoats) return;

    let p2 = player == 0 ? 1 : 0;

    if (this.state.boards[p2][0][index] >= 100) {
      this.state.boards[player][1][index] = TileState.Hit;
      this.state.boards[p2][0][index] = TileState.HitOnBoat;
    } else {
      this.state.boards[player][1][index] = TileState.Miss;
      this.state.boards[p2][0][index] = TileState.Miss;
    }

    this.state.turn = this.state.turn == 0 ? 1 : 0;
    for (let i = 0; i < this.connections.length; i++) {
      this.sendStateUpdate(i);
    }
  }

  private sendStateUpdate(player: number) {
    let msg: StateUpdate = {
      type: MessageType.StateUpdate,
      gameState: this.state.gameState,
      myName: this.state.names[player],
      enemyName: this.state.names[player == 0 ? 1 : 0],
      yourTurn: player == this.state.turn,
      boards: this.state.boards[player],
      boats: this.state.boats,
    };
    this.broadcast(player, msg);
  }
}

export default Battleship;
