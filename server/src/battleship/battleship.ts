import { MessageType, TileState, GameState, StateUpdate } from '../../../interfaces';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';
import { GameBoard } from './state';

interface Connection {
  [key: string]: WebSocket;
}

interface Tokens {
  p1: string;
  p2: string;
}


interface State {
  gameState: GameState,
  names: string[],
  turn: number,
  boats: any,
  boards: number[][][]
}

const defaultGrid = (size: number): number[]  => {
  return new Array(size * size).fill(0);
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
      gameState: GameState.ShootBoats,
      names: ['player1', 'player2'],
      turn: 0,
      boats: [],
      boards: [
        [defaultGrid(10), defaultGrid(10)],
        [defaultGrid(10), defaultGrid(10)]
      ]
    }
  }

  public getTokens(): Tokens {
    return {
      p1: this.p1,
      p2: this.p2
    };
  }

  public isActivated(): boolean {
    return this.activated;
  }

  public activate() {
    this.activated = true;
  }

  public setName(token: string, name: string): boolean {
    // if (this.p1 == token) {
    //   if (this.p2Name == name) return false;
    //   console.log('SET NAME P1', name, this.p1, this.id)
    //   this.p1Name = name;
    //   return true;
    // }

    // if (this.p2 == token) {
    //   if (this.p1Name == name) return false;
    //   console.log('SET NAME P2', name, this.p2, this.id)
    //   this.p2Name = name;
    //   return true;
    // }

    //return false;

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
  }

  private broadcast(player: number, msg: any, all: boolean = false) {
    console.log("???", msg);
    
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
        console.log('place boatz');
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
    // Checks:
    // if (this.state.turn != player) return;
    // if (this.state.gameState != GameState.ShootBoats) return;
    this.state.boards[player][0][index] = 1;
    this.state.boards[player == 0 ? 1 : 0][1][index] = 1;
    for (let i = 0; i < this.connections.length; i++) {
      this.sendStateUpdate(i);
    }
  }

  private sendStateUpdate(player: number) {
    let msg: StateUpdate = {
      type: MessageType.StateUpdate,
      gameState: this.state.gameState,
      names: this.state.names,
      yourTurn: player == this.state.turn,
      boards: this.state.boards[player]
    };
    this.broadcast(player, msg);
  }
}

export default Battleship;