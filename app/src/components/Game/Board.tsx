import React, { useState, useEffect, useRef, createRef } from 'react';

import { atom, useRecoilValue } from 'recoil';

import Grid from './Grid';
import DragGrid from './DragGrid';

export interface Boat {
  x: number;
  y: number;
  width: number;
  height: number;
  mouseOffsetX: number;
  mouseOffsetY: number;
  move: boolean;
}

export const boat = atom({
  key: 'boat',
  default: {
    x: 0, 
    y: 0, 
    width: 6,
    height: 1, 
    mouseOffsetX: 0,
    mouseOffsetY: 0,
    move: false
  } as Boat,
});

//import useGrid, { Grid } from './../useGrid';

import './board.scss';

const SIZE = 10;
const MAX_TILE_WIDTH = 50;
const alpha = 'ABCDEFGHIJKLMNOPQRST';

enum TileState {
  Empty,
  Hit,
  Miss
}

interface GridPosition {
  x: number;
  y: number;
}

const Board = () => {
  const [grid, setGrid] = useState<TileState[]>((new Array(SIZE * SIZE)).fill(TileState.Empty));
  const [tileHeight, setTileHeight] = useState<number>(50);
  const testBoat = useRecoilValue(boat);

  const [position, setPosition] = useState<GridPosition>({x: 0, y: 0});

  const div = useRef<HTMLDivElement | null>(null);

  const observer = useRef(
    new ResizeObserver(() => {
      if (div.current) {
        console.log(div.current.offsetLeft);

        let size = Math.min(div.current.clientWidth / (SIZE + 1), MAX_TILE_WIDTH);
        
        
        setPosition({
          x: div.current.offsetLeft,
          y: div.current.offsetTop
        });
        
        setTileHeight(size);
        //setTileHeight(Math.min(size, 50));
      }
    })
  );

  const action = (id: number) => {
    console.log();
    grid[id] = 1;
    setGrid([...grid]);
    console.log(id);
  }


  useEffect(() => {
    if (div.current) {
      console.log('wtf???')
      observer.current.observe(div.current)
    }

    // return () => {
    //   observer.current.unobserve()
    // }
  }, []);


  const tileStyle = {width: `${tileHeight}px`, height: `${tileHeight}px`};

  return (
    <>
    <div 
      className="boat"
      style={{
        width: `${testBoat.width * tileHeight}px`,
        height: `${testBoat.height * tileHeight}px`,
        top: `${testBoat.y}px`,
        left: `${testBoat.x}px`
      }}
    >myboat</div>

    <div className="board" ref={div} style={{maxWidth: `${MAX_TILE_WIDTH * SIZE}px`}}>
      <div className="board-header board-header-top">
        <div style={tileStyle} className="tile"></div>
        {[...Array(SIZE)].map((_, i) => <div style={tileStyle} className="tile">{alpha[i]}</div>)}
      </div>
      <div className="grid-container">
        <div className="board-header">
          {[...Array(SIZE)].map((_, i) => <div style={tileStyle} className="tile">{i + 1}</div>)}
        </div>
        <div className="grid">
          {/* <Grid tileSize={tileHeight} size={SIZE}></Grid> */}
          <DragGrid tileSize={tileHeight} size={SIZE}></DragGrid>
        </div>
      </div>
    </div>
    </>
  );
}

export default Board;