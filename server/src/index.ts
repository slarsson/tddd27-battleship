import * as express from "express";
import { Request, Response } from "express";
import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
const { PORT = 3000 } = process.env;

const app = express();
const server = app.listen(PORT, () => console.log('started..'));
const wss = new WebSocket.Server({ server: server });

// data
const players = new Map<string, WebSocket | null>();

// middlewares
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
  res.json({ numberOfPlayers: players.size, test: 'ok?' });
});

app.post('/create', (req: Request, res: Response) => {
  const id = uuidv4();
  players.set(id, null);
  res.json({ gameId: 'TODO', token: id });
});

app.post('/join', (req: Request, res: Response) => {
  res.json({});
});

// socket 
wss.on('connection', (ws: WebSocket) => {

  console.log('open..?')
  ws.on('open', (_ws: WebSocket) => {
    console.log('maybe open..?')
  });

  ws.on('message', (msg: string) => {
    console.log(msg);
  });

  ws.on('close', (_ws: WebSocket) => { });
  ws.on('error', (_ws: WebSocket) => { });
  ws.on('ping', (_ws: WebSocket) => { });
  ws.on('pong', (_ws: WebSocket) => { });
});
