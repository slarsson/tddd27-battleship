import React, { useState, useEffect, useRef, createRef } from 'react';

import { boat } from './Boats';

import { atom, useRecoilState, useRecoilValue } from 'recoil';

import Grid from './Grid';
import DragGrid from './DragGrid';

export const tileSizeState = atom({
  key: 'tileSizeState',
  default: 0 as number
});

// export interface Boat {
//   x: number;
//   y: number;
//   targetX: number;
//   targetY: number;
//   width: number;
//   height: number;
//   mouseOffsetX: number;
//   mouseOffsetY: number;
//   move: boolean;
//   transition: string;
// }

// export const boat = atom({
//   key: 'boat',
//   default: {
//     x: 0, 
//     y: 0,
//     targetX: 0,
//     targetY: 0,
//     width: 5,
//     height: 1, 
//     mouseOffsetX: 0,
//     mouseOffsetY: 0,
//     move: false,
//     transition: ''
//   } as Boat,
// });

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

export enum GridType {
  Drag,
  Click
}
interface Props {
  type: GridType;
}

const Board = ({ type }: Props) => {
  const [grid, setGrid] = useState<TileState[]>((new Array(SIZE * SIZE)).fill(TileState.Empty));
  const [tileHeight, setTileHeight] = useState<number>(50);
  const testBoat = useRecoilValue(boat);

  const [tileSize, setTileSize] = useRecoilState(tileSizeState);

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
        
        setTileSize(size);
        
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
    {/* <div 
      className="boat"
      style={{
        width: `${testBoat.width * tileHeight}px`,
        height: `${testBoat.height * tileHeight}px`,
        top: `${testBoat.y}px`,
        left: `${testBoat.x}px`,
        transition: testBoat.transition
      }}
    >myboat</div> */}

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
          {type == GridType.Click ? <Grid tileSize={tileHeight} size={SIZE}></Grid> : null}
          {type == GridType.Drag ? <DragGrid tileSize={tileHeight} size={SIZE}></DragGrid> : null }
        </div>
      </div>
    </div>
    </>
  );
}

export default Board;