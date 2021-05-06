import * as express from 'express';
import { Request, Response } from 'express';
import Battleship from './battleship';
import { validateName, randomId } from './helpers';
import { games } from './state';

// init
const startTime = new Date(Date.now());
const app = express();

// middlewares
app.use((req: Request, res: Response, next: Function) => {
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*', // TODO: maybe fix this..
    'Access-Control-Allow-Headers': 'Origin, Content-type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
  });
  next();
});

app.use(express.json({ limit: '1mb' }));

// routes
app.options('*', (req: Request, res: Response) => res.end(''));

app.head('*', (req: Request, res: Response) => res.end(''));

app.get('/', (req: Request, res: Response) =>
  res.json({
    startTime: startTime.toString(),
    activeGames: games.size,
  })
);

app.get('*', (req: Request, res: Response) => res.status(404).json({}));

app.post('/create', (req: Request, res: Response) => {
  if (req.body.name === undefined) {
    res.status(400).json({ error: 'missing player name' });
    return;
  }

  if (!validateName(req.body.name)) {
    res.status(400).json({ error: 'only a-b or 0-9 in name' });
    return;
  }

  let gameId: string;
  let size = 4;
  for (;;) {
    gameId = randomId(size);
    if (!games.has(gameId)) break;
    size++;
  }

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
    res.status(404).json({ error: 'no game found' });
    return;
  }

  if (game.isActivated()) {
    res.status(404).json({ error: 'the game no longer exists' });
    return;
  }

  res.json({});
});

app.post('/join', (req: Request, res: Response) => {
  if (req.body.gameId === undefined || req.body.name === undefined) {
    res.status(400).json({ error: 'missing gameId and/or name' });
    return;
  }

  if (!validateName(req.body.name)) {
    res.status(422).json({ error: 'only a-b or 0-9 allowed in name' });
    return;
  }

  const game = games.get(req.body.gameId);
  if (game === undefined) {
    res.status(404).json({ error: 'no game found' });
    return;
  }

  if (game.isActivated()) {
    res.status(404).json({ error: 'the game no longer exists' });
    return;
  }

  const tokens = game.getTokens();
  if (!game.setName(tokens.p2, req.body.name)) {
    res.status(422).json({ error: 'name is already taken :(' });
    return;
  }

  game.activate();

  res.json({ token: tokens.p2 });
});

export { app as api };
