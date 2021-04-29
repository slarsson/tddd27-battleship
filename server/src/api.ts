import * as express from 'express';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Battleship from './battleship';
import { validateName } from './lib';
import { games } from './state';
import * as crypto from 'crypto';

// init
const app = express();

app.use((req: Request, res: Response, next: Function) => {
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, Content-type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS'
  });
  next();
});

// middlewares
app.use(express.json({ limit: '1mb' }));

// routes
app.options('*', (req: Request, res: Response) => res.end(''));
app.head('*', (req: Request, res: Response) => res.end(''));
app.get('*', (req: Request, res: Response) => res.status(404).json({}));
app.get('/', (req: Request, res: Response) => res.json({ api: 'v1.0' }));

app.post('/create', (req: Request, res: Response) => {
  if (req.body.name === undefined) {
    res.status(400).json({ error: 'missing player name' });
    return;
  }

  if (!validateName(req.body.name)) {
    res.status(400).json({ error: 'only a-b or 0-9 in name' });
    return;
  }

  // TODO:: check no backslash in URL
  let gameId = crypto.randomBytes(5).toString('base64').slice(0, -1);
  const game = new Battleship(gameId);
  const tokens = game.getTokens();
  game.setName(tokens.p1, req.body.name);
  games.set(gameId, game);
  res.json({
    gameId: gameId,
    token: tokens.p1,
  });
});

app.post('/available', (req: Request, res: Response) => {
  if (req.body.gameId === undefined) {
    res.status(400).json({ error: 'missing gameId' });
    return;
  }

  const game = games.get(req.body.gameId);
  if (game === undefined) {
    res.json({ok: false});
    return;
  }

  if (game.isActivated()) {
    res.json({ok: false});
    return;
  }

  //game.activate();

  res.json({
    ok: true
  });
});

app.post('/join', (req: Request, res: Response) => {
  if (req.body.gameId === undefined || req.body.name === undefined) {
    res.status(400).json({ error: 'missing gameId and/or name' });
    return;
  }

  if (!validateName(req.body.name)) {
    res.status(400).json({ error: 'only a-b or 0-9 in name' });
    return;
  }

  const game = games.get(req.body.gameId);
  if (game === undefined) {
    res.status(422).json({ error: 'no game mate' });
    return;
  }

  if (game.isActivated()) {
    res.status(422).json({ error: 'to late' });
    return;
  }

  const tokens = game.getTokens();
  if (!game.setName(tokens.p2, req.body.name)) {
    res.status(422).json({ error: 'name already taken' });
    return;
  }

  //game.activate();

  res.json({
    token: tokens.p2
  });
});

export { app as api };
