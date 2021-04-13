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

interface Tokens {
  p1: string;
  p2: string;
}

class Battleship {

  private activated: boolean = false;

  private id: string;
  private players: Players = {};

  private p1: string;
  private p2: string;

  private p1Name: string = 'player1';
  private p2Name: string = 'player2';

  constructor(id: string) {
    this.id = id;
    this.p1 = uuidv4();
    this.p2 = uuidv4();
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


  public addPlayer(msg: any, ws: WebSocket): boolean {
    if (msg.token != this.p1 && msg.token != this.p2) return false;

    this.players[msg.token] = {
      name: 'TODO',
      connection: ws
    };

    console.log('JOIN GAME EVENT', this.id);

    this.effect();
    return true;
  }


  public handler(type: MessageType, data: any) {
    if (data.token != this.p1 && data.token != this.p2) return;
    console.log('update:', this.id);
  }

  public effect() {

    let p: string[] = [];

    for (const [key, value] of Object.entries(this.players)) {
      p.push(value.name);
    }

    let msg = JSON.stringify(p);
    for (const [key, value] of Object.entries(this.players)) {
      value.connection.send(msg); // can .send throw?
    }

    //console.log(this.players);
  }
}

export default Battleship;