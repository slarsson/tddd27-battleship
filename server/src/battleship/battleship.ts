import { MessageType, TileState, GameState, Board } from '../../../interfaces';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';
import { State, GameStates, GameBoard } from './state';

interface Connection {
  [key: string]: WebSocket;
}

interface Tokens {
  p1: string;
  p2: string;
}

class Battleship {

  private activated: boolean = false;

  private id: string;
  private connections: Connection = {};

  private p1: string;
  private p2: string;

  private p1Name: string = 'player1';
  private p2Name: string = 'player2';

  private state: State;

  constructor(id: string, size = 5) {
    this.id = id;
    this.p1 = uuidv4();
    this.p2 = uuidv4();
    this.state = {
      mode: GameStates.WaitingForPlayers,
      p1Board: {dimension: size, self: new Array(size * size).fill(TileState.Empty), enemy: new Array(size * size).fill(TileState.Empty)},
      p2Board: {dimension: size, self: new Array(size * size).fill(TileState.Empty), enemy: new Array(size * size).fill(TileState.Empty)}
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
    if (this.p1 == token) {
      if (this.p2Name == name) return false;
      console.log('SET NAME P1', name, this.p1, this.id)
      this.p1Name = name;
      return true;
    }

    if (this.p2 == token) {
      if (this.p1Name == name) return false;
      console.log('SET NAME P2', name, this.p2, this.id)
      this.p2Name = name;
      return true;
    }

    return false;
  }


  public addPlayer(token: string, ws: WebSocket): boolean {
    if (token != this.p1 && token != this.p2) return false;
    this.connections[token] = ws;
    console.log('CONNECT:', token);
    console.log(this.state);
    return true;
  }


  public handler(msg: any) {
    switch (msg.type) {
      case MessageType.Status:
        this.sendBoardState(msg.token);
        break;

      case MessageType.Shoot:
        this.shoot(msg.token, msg.index);
        break;
    
      default:
        break;
    }
  }

  private shoot(token: string, index: number) {
    if ((token != this.p1 && token != this.p2) || index < 0) return;

    if (token == this.p1) {
      if (index >= this.state.p1Board.enemy.length || index >= this.state.p2Board.self.length) return;
      this.state.p1Board.enemy[index] = 999;
      this.state.p2Board.self[index] = 999;      
    } else {
      if (index >= this.state.p2Board.enemy.length || index >= this.state.p1Board.self.length) return;
      this.state.p2Board.enemy[index] = 999;
      this.state.p1Board.self[index] = 999;
    }

    this.sendBoardState(this.p1);
    this.sendBoardState(this.p2);
  } 

  private sendBoardState(token: string) {
    if (token != this.p1 && token != this.p2) return;
    
    let board: GameBoard;
    if (token == this.p1) {
      board = this.state.p1Board;
    } else {
      board = this.state.p2Board
    }

    let msg: GameState = {
      type: MessageType.GameState,
      board: {
        self: board.self, 
        enemy: board.enemy
      }
    };

    this.broadcast(token, msg);
  }

  private broadcast(token: string, msg: any, all = false) {
    const target = this.connections[token];
    if (target === undefined) return;
    // TODO: check errors?
    target.send(JSON.stringify(msg));
  }
}

export default Battleship;