import { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { boat as boatStatex, boatsState } from './../components/Game/Boats';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
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
  const [boat, setBoat] = useRecoilState(boatStatex);

  const [allBoats, setAllBoats] = useRecoilState(boatsState);

  const state = useRef<any>({area: area, selected: -1});

  useEffect(() => {
    const b = [];
    for (let item of allBoats) {
      b.push({...item});
    }
    
    state.current = {
      selected: state.current.selected,
      size: size,
      tileSize: area.width / size,
      area: area,
      grid: grid,
      boat: {...boat},
      boats: clone(allBoats)
    };
  }, [size, area, grid, boat]);

  const mousemove = (evt: MouseEvent) => {
    let index = state.current.selected;
    //console.log(index);
    if (index == -1) return;

    // mut object
    let boat = state.current.boats[index]

    boat.x = evt.pageX - boat.mouseOffsetX;
    boat.y = evt.pageY - boat.mouseOffsetY;
    

    const box = state.current.area;
    if (evt.pageX <= box.x || evt.pageX >= (box.x + box.width) || evt.pageY <= box.y || evt.pageY >= (box.y + box.height)) {
      // let bb = [];
      // for (let item of state.current.boats) {
      //   bb.push({...item});
      // }
      setAllBoats(clone(state.current.boats));
      return;
    }

    for (let i = 0; i < state.current.grid.length; i++) {
      if (state.current.grid[i] == boat.id) {
        state.current.grid[i] = 0;
      }
    }

    let row = Math.floor((evt.pageY + (0.5 * state.current.tileSize) - boat.mouseOffsetY - box.y) / state.current.tileSize);
    let col = Math.floor((evt.pageX + (0.5 * state.current.tileSize) - boat.mouseOffsetX - box.x) / state.current.tileSize);

    if (row >= 0 && (row + boat.height) <= state.current.size && col >= 0 && (col + boat.width) <= state.current.size) {
      
      let collision = false;
      let start = row * state.current.size;
      Test:
      for (let i = 0; i < state.current.size; i++) {
        if (i < row || i >= (row + boat.height)) continue;
        for (let j = col; j < col + boat.width; j++) {
          let idx = Math.min(state.current.size * i + j, (state.current.size * state.current.size - 1));
          if (state.current.grid[idx] != 0) {
            collision = true;
            break Test;
          }
          state.current.grid[idx] = boat.id;
        }
      }

      if (collision) {
        for (let i = 0; i < state.current.grid.length; i++) {
          if (state.current.grid[i] == boat.id) {
            state.current.grid[i] = 0;
          }
          boat.targetX = state.current.boat.originX;
          boat.targetY = state.current.boat.originY;
        }
      } else {        
        boat.targetX = state.current.area.x + (col * state.current.tileSize);
        boat.targetY = state.current.area.y + (row * state.current.tileSize);
      }
    } else {
      boat.targetX = state.current.boat.originX;
      boat.targetY = state.current.boat.originY;
    }

    setGrid([...state.current.grid]);  
    setAllBoats(clone(state.current.boats));
  }; 

  const mousedown = (evt: MouseEvent) => {
    let size = state.current.tileSize;
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
    
    setAllBoats(clone(state.current.boats));
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

    setAllBoats(clone(state.current.boats));
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
