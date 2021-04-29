export enum MessageType {
  // incoming
  Connect = 'connect',
  Status = 'status',
  SetBoats = 'setboats',
  Shoot = 'shoot',

  // outgoing
  StateUpdate = 'stateupdate'
}

export enum GameState {
  WaitingForPlayers = 'waitingforplayers',
  PlaceBoats = 'placeboats',
  ShootBoats = 'shootboats',
  Completed = 'completed'
}

export * from './incoming';
export * from './outgoing';
export * from './board';
