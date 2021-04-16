export enum MessageType {
  // incoming
  Connect = 'connect',
  Status = 'status',
  Shoot = 'shoot',

  // outgoing
  GameState = 'gamestate'
}

export * from './incoming';
export * from './outgoing';
export * from './board';
