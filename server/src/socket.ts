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
    ws.on('message', (payload: string) => {
      let msg: any;
      try {
        msg = JSON.parse(payload);
        if (!validateMessage(msg)) {
          // TODO: disconnect client
          return;
        }
      } catch (err) {
        console.error(err);
        // TODO: disconnect client
        return;
      }

      const game = games.get(msg.gameId);
      if (game === undefined) {
        console.error('game not found');
        // TODO: error?
        return;
      }

      if (msg.type == MessageType.Connect) {
        game.addPlayer(msg.token, ws);
        return;
      }

      game.handler(msg);
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
