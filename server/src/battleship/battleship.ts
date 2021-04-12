import { MessageType } from '../../../interfaces';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';

interface Player {
  name: string;
  connection: WebSocket;
}

interface Players {
  [key: string]: Player;
}

class Battleship {

  private id: string;
  private players: Players = {};

  private p1: string;
  private p2: string;

  constructor(id: string, p1: string) {
    this.id = id;
    this.p1 = p1;
    this.p2 = uuidv4();
  }

  public addPlayer(msg: any, ws: WebSocket): boolean {
    if (msg.type != MessageType.JOIN) return false;
    if (!('token' in msg)) return false;

    // ?
    const token: string = msg.token;

    this.players[token] = {
      name: 'TODO',
      connection: ws
    };
    return true;
  }


  public handler(type: MessageType, data: any) {
    if (data.token != this.p1 && data.token != this.p2) return;
    console.log('update:', this.id);
  }
}

export default Battleship;