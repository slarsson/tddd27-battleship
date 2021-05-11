import { useState, useEffect, useRef } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { Boat } from '../components/Board/Boats';
import { boatsState } from '../components/Board/state';

export const gridActions = atom({
  key: 'gridActions',
  default: {
    random: (): void => {},
    export: (): number[] | void => {},
    setBoats: (sizes: number[]): void => {},
  },
});

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface State {
  selected: number;
  size: number;
  tileSize: number;
  area: Box;
  grid: any; // TODO
  boats: Boat[];
}

interface MoveEvent {
  pageX: number;
  pageY: number;
}

const clone = (items: any) => {
  let arr = [];
  for (let item of items) {
    arr.push({ ...item });
  }
  return arr;
};

const useGrid = (size: number, area: Box): number[] => {
  const [grid, setGrid] = useState<number[]>(new Array(size * size).fill(0));
  const [boats, setBoats] = useRecoilState(boatsState);
  const setGridActions = useSetRecoilState(gridActions);
  const state = useRef<State>({ area: area, selected: -1, size: 0, tileSize: 0, grid: grid, boats: [] });

  useEffect(() => {
    state.current = {
      selected: state.current.selected,
      size: size,
      tileSize: area.width / size,
      area: area,
      grid: grid,
      boats: clone(boats),
    };
  }, [size, area, grid, boats]);

  const move = (evt: MoveEvent) => {
    let index = state.current.selected;
    if (index == -1) return;

    console.log(state.current.area.y);

    // mutable object
    let boat = state.current.boats[index];

    // set boat position
    boat.x = evt.pageX - boat.mouseOffsetX;
    boat.y = evt.pageY - boat.mouseOffsetY;

    // check if boat is outside the grid
    const box = state.current.area;
    if (evt.pageX <= box.x || evt.pageX >= box.x + box.width || evt.pageY <= box.y || evt.pageY >= box.y + box.height) {
      setBoats(clone(state.current.boats));
      return;
    }

    // remove last boat position
    for (let i = 0; i < state.current.grid.length; i++) {
      if (state.current.grid[i] == boat.id) {
        state.current.grid[i] = 0;
      }
    }

    // get top-left boat tile row and col
    let row = Math.floor((evt.pageY + 0.5 * state.current.tileSize - boat.mouseOffsetY - box.y) / state.current.tileSize);
    let col = Math.floor((evt.pageX + 0.5 * state.current.tileSize - boat.mouseOffsetX - box.x) / state.current.tileSize);

    // check if whole boat is inside of grid
    if (row >= 0 && row + boat.height <= state.current.size && col >= 0 && col + boat.width <= state.current.size) {
      let collision = false;

      // add boat to grid
      Loop: for (let i = 0; i < state.current.size; i++) {
        if (i < row || i >= row + boat.height) continue;
        for (let j = col; j < col + boat.width; j++) {
          let idx = Math.min(state.current.size * i + j, state.current.size * state.current.size - 1);
          if (state.current.grid[idx] != 0) {
            collision = true;
            break Loop;
          }
          state.current.grid[idx] = boat.id;
        }
      }

      // reset if position already taken
      if (collision) {
        for (let i = 0; i < state.current.grid.length; i++) {
          if (state.current.grid[i] == boat.id) {
            state.current.grid[i] = 0;
          }
          boat.targetX = boat.originX;
          boat.targetY = boat.originY;
        }
      } else {
        // set expected position, position of tiles
        boat.targetX = state.current.area.x + col * state.current.tileSize;
        boat.targetY = state.current.area.y + row * state.current.tileSize;
        boat.originX = boat.targetX;
        boat.originY = boat.originY;
      }
    } else {
      boat.targetX = boat.originX;
      boat.targetY = boat.originY;
    }

    setGrid([...state.current.grid]);
    setBoats(clone(state.current.boats));
  };

  const down = (evt: MoveEvent) => {
    let size = state.current.tileSize;

    // find selected boat
    for (let i = 0; i < state.current.boats.length; i++) {
      let boat = state.current.boats[i];
      if (evt.pageX < boat.x || evt.pageX > boat.x + size * boat.width) continue;
      if (evt.pageY < boat.y || evt.pageY > boat.y + size * boat.height) continue;
      state.current.selected = i;
      break;
    }

    console.log('found', state.current.selected);

    let index = state.current.selected;
    if (index == -1) return;

    document.body.style.overflow = 'hidden';

    state.current.boats[index].move = true;
    state.current.boats[index].mouseOffsetX = evt.pageX - state.current.boats[index].x;
    state.current.boats[index].mouseOffsetY = evt.pageY - state.current.boats[index].y;
    state.current.boats[index].transition = '';

    setBoats(clone(state.current.boats));
  };

  const up = () => {
    let index = state.current.selected;
    if (!state.current.boats[index]) {
      state.current.selected = -1;
      return;
    }

    state.current.boats[index].move = false;
    state.current.boats[index].x = state.current.boats[index].targetX;
    state.current.boats[index].y = state.current.boats[index].targetY;
    state.current.boats[index].transition = 'left 0.1s ease-out, top 0.1s ease-out';

    state.current.selected = -1;

    setBoats(clone(state.current.boats));
  };

  const touchmove = (evt: TouchEvent) => {
    move({
      pageX: evt.touches[0].clientX,
      pageY: evt.touches[0].clientY,
    });
  };

  const touchstart = (evt: TouchEvent) => {
    down({
      pageX: evt.touches[0].clientX,
      pageY: evt.touches[0].clientY,
    });
  };

  const mousemove = (evt: MouseEvent) => {
    move({
      pageX: evt.pageX,
      pageY: evt.pageY,
    });
  };

  const mousedown = (evt: MouseEvent) => {
    down({
      pageX: evt.pageX,
      pageY: evt.pageY,
    });
  };

  const randomEmptySlot = (index: number) => {
    Main: for (;;) {
      const gridIndex = Math.trunc(Math.random() * state.current.grid.length);
      const endRowIndex = gridIndex + (state.current.boats[index].height - 1) * size;
      const endColIndex = gridIndex + state.current.boats[index].width - 1;

      const startRow = Math.trunc(gridIndex / size);
      const endRow = Math.trunc(endRowIndex / size);
      const startCol = gridIndex % size;
      const endCol = endColIndex % size;

      if (endRow >= size) continue;
      if (endCol < startCol) continue;

      // collision col
      for (let j = gridIndex; j <= endColIndex; j++) {
        if (state.current.grid[j] != 0) {
          continue Main;
        }
      }

      // collision row
      for (let j = gridIndex; j <= endRowIndex; j += size) {
        if (state.current.grid[j] != 0) {
          continue Main;
        }
      }

      const id = state.current.boats[index].id;
      for (let j = 0; j < state.current.boats[index].width; j++) {
        state.current.grid[gridIndex + j] = id;
      }

      for (let j = 0; j < state.current.boats[index].height; j++) {
        state.current.grid[gridIndex + j * size] = id;
      }

      const x = state.current.area.x + state.current.tileSize * startCol;
      const y = state.current.area.y + state.current.tileSize * startRow;

      return { x, y };
    }
  };

  const random = () => {
    for (let i = 0; i < state.current.grid.length; i++) {
      state.current.grid[i] = 0;
    }

    Main: for (let i = 0; i < state.current.boats.length; i++) {
      const { x, y } = randomEmptySlot(i);

      state.current.boats[i].x = x;
      state.current.boats[i].y = y;
      state.current.boats[i].originX = x;
      state.current.boats[i].originY = y;
      state.current.boats[i].targetX = x;
      state.current.boats[i].targetY = y;
    }

    setBoats(clone(state.current.boats));
    setGrid([...state.current.grid]);
  };

  const loadBoats = (sizes: number[]) => {
    let newBoats: Boat[] = [];

    for (let i = 0; i < sizes.length; i++) {
      let w, h: number;
      if (Math.random() > 0.5) {
        w = 1;
        h = sizes[i];
      } else {
        w = sizes[i];
        h = 1;
      }

      const x = -9999;
      const y = -9999;
      newBoats.push({
        id: 100 + i,
        x: x,
        y: y,
        originX: x,
        originY: y,
        targetX: x,
        targetY: y,
        width: w,
        height: h,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        move: false,
        transition: '',
      });
    }

    setTimeout(() => random(), 500);
    setBoats(newBoats);
  };

  const rotate = (evt: KeyboardEvent) => {
    if (evt.key != 'r') return;

    let index = state.current.selected;
    if (index == -1) return;

    let boat = state.current.boats[index];

    const offsetX = boat.mouseOffsetX;
    const offsetY = boat.mouseOffsetY;
    const pageX = boat.x + boat.mouseOffsetX;
    const pageY = boat.y + boat.mouseOffsetY;

    [boat.height, boat.width] = [boat.width, boat.height];

    boat.x = pageX - offsetY;
    boat.y = pageY - offsetX;
    boat.mouseOffsetX = offsetY;
    boat.mouseOffsetY = offsetX;

    const { x, y } = randomEmptySlot(index);
    boat.originX = x;
    boat.originY = y;
    boat.targetX = x;
    boat.targetY = y;

    for (let i = 0; i < state.current.grid.length; i++) {
      if (state.current.grid[i] != boat.id) continue;
      state.current.grid[i] = 0;
    }

    setBoats(clone(state.current.boats));
    setGrid([...state.current.grid]);
  };

  const exportGrid = () => {
    return [...state.current.grid];
  };

  useEffect(() => {
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', touchmove);
    window.addEventListener('touchstart', touchstart);
    window.addEventListener('touchend', up);
    window.addEventListener('touchcancel', up);
    window.addEventListener('keydown', rotate);

    setGridActions({ random: random, export: exportGrid, setBoats: loadBoats });

    return () => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', touchmove);
      window.removeEventListener('touchstart', touchstart);
      window.removeEventListener('touchend', up);
      window.removeEventListener('touchcancel', up);
      window.removeEventListener('keydown', rotate);
    };
  }, []);

  return grid;
};

export default useGrid;
