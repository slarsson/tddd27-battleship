import { api } from './api';
import { ws } from './socket';

const PORT = process.env.PORT || 3000;

const server = api.listen(PORT, () => {
  console.log('express started'.padEnd(20), '✅');
});

const wss = ws(server, () => {
  console.log('websocket started'.padEnd(20), '✅');
});
