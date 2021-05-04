import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import Board, { GridType } from '../Board/Board';
import Boats, { Boat } from '../Board/Boats';
import { boatsState, tileSizeState } from '../../components/Board/state';
import { gridActions } from '../../hooks/useGrid';
import { currentGameState } from '../../atoms/game';

const createBoats = (top: number, left: number, tileSize: number, sizes: number[]): Boat[] => {
  let boats: Boat[] = [];
  for (let i = 0; i < sizes.length; i++) {
    let x = left;
    let y = top;

    let w = sizes[i];
    let h = 1;
    
    boats.push({
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
      transition: ''
    });
  }

  return boats;
}


const PlaceBoats = () => {
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [boats, setBoats] = useRecoilState<Boat[]>(boatsState);
  const tileSize = useRecoilValue<number>(tileSizeState);
  const boatHouse = useRef<HTMLDivElement | null>(null);
  const div = useRef<HTMLDivElement | null>(null);
  const grid = useRecoilValue(gridActions);
  const game = useRecoilValue(currentGameState);


  useEffect(() => {
    console.log('boats:', game.boats);
  }, [game.boats]);

  //console.log('test:', tileSize);

  const boatStuff = () => {
    console.log(game);
      
    if (!boatHouse.current) return;  
    let values = createBoats(boatHouse.current.offsetTop, boatHouse.current.offsetLeft, tileSize, game.boats);

    console.log(values);

    setBoats([...values]);

    
    // if (!boatHouse.current) return;  
    // let vertical = false;
    // if (boatHouse.current.clientWidth >= boatHouse.current.clientHeight) vertical = true;
    // let values = randomBoats(boatHouse.current.offsetTop, boatHouse.current.offsetLeft, tileSize, vertical);
    // setBoats([...values]);
  };

  const resize = () => {
    boatStuff();
    if (div.current) {
      if (div.current.clientWidth > 800) {
        setMaxWidth(Math.min(window.innerHeight * 0.4, div.current.clientWidth * 0.5) - 20);
      } else {
        setMaxWidth(Math.min(window.innerHeight * 0.4, div.current.clientWidth) - 20);
      }
    }
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => boatStuff(), [tileSize]);

  return (
    <div>
      <Boats></Boats>
      <div className="place-boats-container" ref={div}>
        <div className="board-container">
          <Board type={GridType.Drag} maxWidth={maxWidth}></Board>
        </div>
        <div className="boats-container">
          <div 
            ref={boatHouse}
            style={{
              width: `${tileSize * 5}px`,
              minHeight: `${tileSize * 5}px`,
              height: '90%'
            }}
          ></div>
          <button onClick={() => grid.clear()}>
            <p>CLEAR</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceBoats;

//
// TODO: remove this part
const randomBoats = (top: number, left: number, tileSize: number, mobile: boolean = false): Boat[] => {
  let vertical = 0;
  let horizontal = 0;  
  let boats: Boat[] = [];
  let maxY = 0;
  let maxX = 0;

  for (let i = 0; i < 5; i++) {
    let w = Math.ceil(Math.random() * 4) + 1;
    let h = 1;
    if (i > 2) {
      h = Math.ceil(Math.random() * 4) + 1;
      w = 1;
    }

    let x: number;
    let y: number;

    if (w > h) {
      x = left;
      y = top + tileSize * vertical;
      vertical++;
      maxY = y;
    } else {
      x = left + horizontal * tileSize;
      y = top + 5 * tileSize ;
      horizontal++;
      maxX = x;
    }

    boats.push({
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
      transition: ''
    });
  }

  if (mobile) {
    let i = 0;
    for (let boat of boats) {
      if (boat.y > maxY) {
        boat.x = left + (5 + i) * tileSize;
        boat.originX = left + (5 + i) * tileSize;
        boat.targetX = left + (5 + i) * tileSize;
        boat.y = top;
        boat.originY = top;
        boat.targetY = top;
        i++;
      }
    }
  } else {
    for (let boat of boats) {
      if (boat.y > maxY) {
        boat.y = maxY + tileSize;
        boat.originY = maxY + tileSize;
        boat.targetY = maxY + tileSize;
      }
    }
  }

  return boats;
};