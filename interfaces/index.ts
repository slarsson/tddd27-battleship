export enum MessageType {
  // incoming
  Connect = 'connect',
  Status = 'status',
  Shoot = 'shoot',

  // outgoing
  StateUpdate = 'stateupdate'
}

export enum GameState {
  Waiting = 'waiting',
  AddBoats = 'addboats'
  
}

export * from './incoming';
export * from './outgoing';
export * from './board';
