import { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { boat as boatState } from './../components/Game/Board';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const useGrid = (size: number, area: Box) => {
  const [items, setItems] = useState<number[]>([]);
  const [grid, setGrid] = useState<number[]>(new Array(size * size).fill(0));
  const [boat, setBoat] = useRecoilState(boatState);

  const state = useRef<any>({area: area});

  useEffect(() => {
    state.current = {
      size: size,
      tileSize: area.width / size,
      area: area,
      grid: grid,
      boat: {...boat},
    };
  }, [size, area, grid, boat]);

  const mousemove = (evt: MouseEvent) => {
    //console.log(state.current.boat);
    if (!state.current.boat.move) {
      return;
    }
    
    state.current.boat.x = evt.pageX - state.current.boat.mouseOffsetX;
    state.current.boat.y = evt.pageY - state.current.boat.mouseOffsetY;
    setBoat({...state.current.boat});

    const box = state.current.area;
    if (evt.pageX <= box.x || evt.pageX >= (box.x + box.width)) return;
    if (evt.pageY <= box.y || evt.pageY >= (box.y + box.height)) return;

    // const tileSize = box.width / size;
    // const col = Math.floor((evt.pageX - box.x) / tileSize);
    // const row = Math.floor((evt.pageY - box.y) / tileSize);
    // const index = row * size + col;
    

    for (let i = 0; i < state.current.grid.length; i++) {
      state.current.grid[i] = 0;
    }

    let row = Math.floor((evt.pageY + (0.5 * state.current.tileSize) - state.current.boat.mouseOffsetY - box.y) / state.current.tileSize);
    let col = Math.floor((evt.pageX + (0.5 * state.current.tileSize) - state.current.boat.mouseOffsetX - box.x) / state.current.tileSize);

    //console.log(col);

    let start = row * state.current.size;
    //let end = Math.min(start + (state.current.size * state.current.boat.height), size * size);

    for (let i = 0; i < state.current.size; i++) {
      if (i < row || i >= (row + state.current.boat.height)) continue;
      for (let j = col; j < col + state.current.boat.width; j++) {
        let idx = Math.min(state.current.size * i + j, (state.current.size * state.current.size - 1));
        state.current.grid[idx] = 7;
      }
    }
    
    //let start = row * state.current.size;
    // let end = Math.min(start + (state.current.size * state.current.boat.height), size * size);
    // for (let i = start; i < end; i++) {
    //   state.current.grid[i] = 6;
    // }
    


    //console.log(yTop);

    // console.log(yCenter);

    // state.current.grid[index] = -1;
    setGrid([...state.current.grid]);

    
  }; 

  const mousedown = (evt: MouseEvent) => {
    let size = state.current.tileSize;
    let boat = state.current.boat;

    if (evt.pageX < boat.x || evt.pageX > (boat.x + size * boat.width)) return;
    if (evt.pageY < boat.y || evt.pageY > (boat.y + size * boat.height)) return;

    console.log('myboat');
    //console.log(boat);


    boat.move = true;
    boat.mouseOffsetX = evt.pageX - boat.x;
    boat.mouseOffsetY = evt.pageY - boat.y;
    setBoat({...boat})
    //console.log(state.current.boat);
  };

  const mouseup = () => {
    state.current.boat.move = false;
    setBoat({...state.current.boat})
    // console.log(state.current.boat);
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

  return { boats: items, grid: grid };
};

export default useGrid;
