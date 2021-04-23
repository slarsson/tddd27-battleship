import { Boat } from './Boats'
import { atom } from 'recoil';

const tileSizeState = atom({
  key: 'tileSizeState',
  default: 0 as number
});

const boatsState = atom({
  key: 'boatsState',
  default: [] as Boat[]
});

export {
  tileSizeState,
  boatsState
}