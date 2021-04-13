import * as WebSocket from 'ws';
import * as express from 'express';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateMessage, MessageType } from '../../interfaces';
import { games } from './state';
import Battleship from './battleship';

const ws = (server: any, cb: any): WebSocket.Server => {
  const wss = new WebSocket.Server({ server: server });

  cb();

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (msg: string) => {
      //console.log('MSG:', msg);

      let data: any;
      let type: MessageType;
      try {
        data = JSON.parse(msg);
        type = validateMessage(data);
        // TODO: add some type check
      } catch (err) {
        console.error(err);
        return;
        // TODO: disconnect client
      }

      const game = games.get(data.gameId);
      if (game === undefined) {
        console.error('game not found');
        // TODO
        return;
      }

      if (data.type == MessageType.JOIN) {
        game.addPlayer(data, ws);
        return;
      }

      game.handler(type, data);
    });

    setInterval(() => {
      ws.ping();
    }, 1000);

    ws.on('open', (w: WebSocket) => { });
    ws.on('close', (w: WebSocket) => { });
    ws.on('error', (w: WebSocket) => { });
    ws.on('ping', (w: WebSocket) => w.pong());

    ws.on('pong', (w: WebSocket) => {
      //console.log('RECIVED PONG');
    });
  });

  return wss;
}

export { ws };
