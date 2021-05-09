import { MessageType, TileState, GameState, StateUpdate } from '../../interfaces';
import { defaultGrid } from './helpers';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';

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
  positions: Map<number, number[]>[];
  score: number[];
}

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
      positions: [new Map<number, number[]>(), new Map<number, number[]>()],
      score: [0, 0],
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

  // TODO: does this work?
  public setName(token: string, name: string): boolean {
    if (token != this.p1 && token != this.p2) return false;

    let player: number = 0;
    let p2: number = 1;
    if (token == this.p2) {
      player = 1;
      p2 = 0;
    }

    if (this.state.names[p2] == name) return false;
    this.state.names[player] = name;
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

    if (this.connections[0] !== null && this.connections[1] !== null) {
      if (this.state.gameState == GameState.WaitingForPlayers) {
        this.state.gameState = GameState.PlaceBoats;
      }
    }

    if (this.connections[0] !== null) {
      this.sendStateUpdate(0);
    }

    if (this.connections[1] !== null) {
      this.sendStateUpdate(1);
    }
  }

  private broadcast(player: number, msg: any) {
    this.connections[player]?.send(JSON.stringify(msg));
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

        const grid = msg.grid;

        if (grid.length != 100) return;

        let ids = this.state.boats.map((v, i) => 100 + i);
        ids.push(TileState.Empty);

        for (let i = 0; i < grid.length; i++) {
          if (!ids.includes(grid[i])) return;
        }

        // TODO: check
        // this.state.boards[player][0] = msg.grid;

        for (let i = 0; i < this.state.boats.length; i++) {
          const id = 100 + i;
          let indices = [];
          for (let j = 0; j < grid.length; j++) {
            if (id == grid[j]) {
              indices.push(j);
            }
          }

          if (indices.length == 0) {
            this.state.positions[player].clear();
            return;
          }
          this.state.positions[player].set(id, indices);
        }

        this.state.boards[player][0] = grid;
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
      const id = this.state.boards[p2][0][index];
      const indices = this.state.positions[p2].get(id);
      if (indices == undefined) return;

      let completed = true;
      for (let i = 0; i < indices.length; i++) {
        let idx = indices[i];
        if (index == idx) continue;
        if (this.state.boards[p2][0][idx] != TileState.HitOnBoat) {
          completed = false;
          break;
        }
      }

      if (completed) {
        this.state.score[player]++;

        if (this.state.score[player] == this.state.positions[p2].size) {
          this.state.gameState = GameState.Completed;
        }

        for (let i = 0; i < indices.length; i++) {
          this.state.boards[player][1][indices[i]] = TileState.BoatCompleted;
        }
      } else {
        this.state.boards[player][1][index] = TileState.Hit;
      }
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
    const p2 = player == 0 ? 1 : 0;
    let msg: StateUpdate = {
      type: MessageType.StateUpdate,
      gameState: this.state.gameState,
      myName: this.state.names[player],
      myScore: this.state.score[player],
      enemyName: this.state.names[p2],
      enemyScore: this.state.score[p2],
      yourTurn: player == this.state.turn,
      boards: this.state.boards[player],
      boats: this.state.boats,
    };
    this.broadcast(player, msg);
  }
}

export default Battleship;
