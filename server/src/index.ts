import * as express from 'express';
import { Request, Response } from 'express';
import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { validateMessage, MessageType } from '../../interfaces';
import Battleship from './battleship';

// setup 
const app = express();
const server = app.listen(3000, () => console.log('started..'));
const wss = new WebSocket.Server({ server: server });

// state
const games = new Map<string, Battleship>();

// middlewares
app.use(express.json({ limit: '1mb' }));

app.use((req: Request, res: Response, next: Function) => {
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, Content-type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS'
  });
  next();
});

// routes
app.get('/', (req: Request, res: Response) => {
  res.json({ api: 0 });
});

app.post('/create', (req: Request, res: Response) => {
  const token = uuidv4();
  const id = uuidv4();

  games.set(id, new Battleship(id, token));

  res.json({
    gameId: id,
    token: token
  });
});

app.post('/join', (req: Request, res: Response) => {
  if (!('gameId' in req.body)) {
    res.status(400).json({
      error: 'missing gameId'
    });
    return;
  }

  const game = games.get(req.body.gameId);
  if (game === undefined) {
    // use 422?
    res.status(422).json({
      error: 'no game mate'
    });
    return;
  }

  const token = game.request();
  if (token === null) {
    res.status(422).json({
      error: 'to late'
    });
    return;
  }

  console.log(req.body);

  res.json({
    token: token
  });
});

app.options('*', (req: Request, res: Response) => res.end(''));

// socket 
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
    console.log('RECIVED PONG');
  });
});
