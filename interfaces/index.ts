export enum MessageType {
  // incoming
  Connect = 'connect',
  Status = 'status',
  SetBoats = 'setboats',
  Shoot = 'shoot',

  // outgoing
  StateUpdate = 'stateupdate',
  Boats = 'boats',
}

export enum GameState {
  Loading = 'loading',
  WaitingForPlayers = 'waitingforplayers',
  PlaceBoats = 'placeboats',
  ShootBoats = 'shootboats',
  Completed = 'completed',
}

export enum TileState {
  Empty,
  Available,
  Hit,
  HitOnBoat,
  BoatCompleted,
  Miss,
  Loading,
}

export * from './incoming';
export * from './outgoing';
