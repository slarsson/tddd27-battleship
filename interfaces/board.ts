export enum TileState {
  Empty,
  Taken,
  Hit,
  Miss,
}

export interface Board {
  self: TileState[];
  enemy: TileState[];
}
