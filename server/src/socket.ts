import * as WebSocket from 'ws';
import { Request } from 'express';
import { validateMessage, MessageType } from '../../interfaces';
import { games } from './state';

const ws = (server: any, cb: any): WebSocket.Server => {
  const wss = new WebSocket.Server({ server: server });

  cb();

  wss.on('connection', (ws: WebSocket, req: Request) => {
    console.log(
      'NEW CONNECTION:',
      req.connection.remoteAddress,
      '=>',
      req.headers['user-agent']
    );

    const keepAlive = () => {
      ws.ping();
      tOut = setTimeout(keepAlive, 1000);
    };

    let tOut = setTimeout(keepAlive, 1000);

    ws.on('message', (payload: string) => {
      let msg: any;
      try {
        msg = JSON.parse(payload);
        console.log('payload:', msg);
        if (!validateMessage(msg)) {
          ws.terminate();
          return;
        }
      } catch (err) {
        ws.terminate();
        return;
      }

      const game = games.get(msg.gameId);
      if (game === undefined) {
        ws.send(JSON.stringify({ type: MessageType.NotFound }));
        ws.terminate();
        return;
      }

      if (msg.type == MessageType.Connect) {
        game.addConnection(msg.token, ws);
        return;
      }

      game.handler(msg);
    });

    ws.on('close', (w: WebSocket) => {
      clearTimeout(tOut);
      console.log(
        'CLOSE:',
        req.connection.remoteAddress,
        '=>',
        req.headers['user-agent']
      );
    });

    ws.on('error', (w: WebSocket) => {
      clearTimeout(tOut);
      console.log(
        'ERROR:',
        req.connection.remoteAddress,
        '=>',
        req.headers['user-agent']
      );
    });
  });

  return wss;
};

export { ws };
