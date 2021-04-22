import { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { Boat } from './../components/Game/Boats';
import { boatsState } from './../components/Game/state';

interface Box {
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

const clone = (items: any) => {
  let arr = [];
  for (let item of items) {
    arr.push({...item});
  }
  return arr;
}

const useGrid = (size: number, area: Box): number[] => {
  const [grid, setGrid] = useState<number[]>(new Array(size * size).fill(0));
  const [boats, setBoats] = useRecoilState(boatsState);

  const state = useRef<State>({area: area, selected: -1, size: 0, tileSize: 0, grid: grid, boats: []});

  // use ref to keep reference when using addEventListener
  useEffect(() => {
    state.current = {
      selected: state.current.selected,
      size: size,
      tileSize: area.width / size,
      area: area,
      grid: grid,
      boats: clone(boats)
    };
  }, [size, area, grid]);

  const mousemove = (evt: MouseEvent) => {
    let index = state.current.selected;
    if (index == -1) return;

    // mutable object
    let boat = state.current.boats[index]

    // set boat position
    boat.x = evt.pageX - boat.mouseOffsetX;
    boat.y = evt.pageY - boat.mouseOffsetY;
    
    // check if boat is outside the grid
    const box = state.current.area;
    if (evt.pageX <= box.x || evt.pageX >= (box.x + box.width) || evt.pageY <= box.y || evt.pageY >= (box.y + box.height)) {
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
    let row = Math.floor((evt.pageY + (0.5 * state.current.tileSize) - boat.mouseOffsetY - box.y) / state.current.tileSize);
    let col = Math.floor((evt.pageX + (0.5 * state.current.tileSize) - boat.mouseOffsetX - box.x) / state.current.tileSize);

    // check if whole boat is inside of grid
    if (row >= 0 && (row + boat.height) <= state.current.size && col >= 0 && (col + boat.width) <= state.current.size) {
      let collision = false;
      
      // add boat to grid
      Loop:
      for (let i = 0; i < state.current.size; i++) {
        if (i < row || i >= (row + boat.height)) continue;
        for (let j = col; j < col + boat.width; j++) {
          let idx = Math.min(state.current.size * i + j, (state.current.size * state.current.size - 1));
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
        boat.targetX = state.current.area.x + (col * state.current.tileSize);
        boat.targetY = state.current.area.y + (row * state.current.tileSize);
      }
    } else {
      boat.targetX = boat.originX;
      boat.targetY = boat.originY;
    }

    setGrid([...state.current.grid]);  
    setBoats(clone(state.current.boats));
  }; 

  const mousedown = (evt: MouseEvent) => {
    let size = state.current.tileSize;
    
    // find selected boat
    for (let i = 0; i < state.current.boats.length; i++) {
      let boat = state.current.boats[i];
      if (evt.pageX < boat.x || evt.pageX > (boat.x + size * boat.width)) continue;
      if (evt.pageY < boat.y || evt.pageY > (boat.y + size * boat.height)) continue;
      state.current.selected = i;
      break;
    }

    let index = state.current.selected; 
    if (index == -1) return;
    
    state.current.boats[index].move = true;
    state.current.boats[index].mouseOffsetX = evt.pageX - state.current.boats[index].x;
    state.current.boats[index].mouseOffsetY = evt.pageY - state.current.boats[index].y;
    state.current.boats[index].transition = '';
    
    setBoats(clone(state.current.boats));
  };

  const mouseup = () => {
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

  useEffect(() => {
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', mouseup);

    return () => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mouseup', mouseup);
    }
  }, []);

  return grid;
};

export default useGrid;
export type {
  Box
}
