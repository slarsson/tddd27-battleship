import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import Grid from './Grid';

import DragGrid from './DragGrid';
import ViewGrid from './ViewGrid';
import { tileSizeState } from './state';

import './board.scss';

enum GridType {
  Drag,
  Click,
  View
}

interface Props {
  type: GridType;
  test?: number;
}

const SIZE = 10;
const MAX_TILE_WIDTH = 60;
const alpha = 'ABCDEFGHIJKLMNOPQRST';

const Board = ({ type, test }: Props) => {
  const [tileSize, setTileSize] = useRecoilState<number>(tileSizeState);
  
  const div = useRef<HTMLDivElement | null>(null);
  const observer = useRef(
    new ResizeObserver(() => {
      if (div.current && test == undefined) {
        
        console.log(window.innerHeight);
        
        setTileSize((window.innerHeight * 0.4) / 11);
        //setTileSize(Math.min(div.current.clientWidth / (SIZE + 1), MAX_TILE_WIDTH));
      }
    })
  );

  useEffect(() => {
    if (div.current) {
      observer.current.observe(div.current)
    }
  }, []);

  let tileStyle = {width: `${tileSize}px`, height: `${tileSize}px`};

  if (test) {
    tileStyle = {width: `${test}px`, height: `${test}px`};
  }

  return (
    <div className="board" ref={div} style={{maxWidth: `${MAX_TILE_WIDTH * SIZE}px`, width: `${tileSize * 11 + 1}px`}}>
      {/* <div className="board" ref={div} style={{maxWidth: `${MAX_TILE_WIDTH * SIZE}px`}}> */}
      <div className="board-header board-header-top">
        <div style={tileStyle} className="tile"></div>
        {[...Array(SIZE)].map((_, i) => <div style={tileStyle} className="tile" key={'top-' + i}>{alpha[i]}</div>)}
      </div>
      <div className="grid-container">
        <div className="board-header">
          {[...Array(SIZE)].map((_, i) => <div style={tileStyle} className="tile" key={'left-' + i}>{i + 1}</div>)}
        </div>
        <div className="grid">
          {type == GridType.Click ? <Grid tileSize={tileSize} size={SIZE}></Grid> : null}
          {type == GridType.Drag ? <DragGrid tileSize={tileSize} size={SIZE}></DragGrid> : null }
          {type == GridType.View ? <ViewGrid tileSize={test ? test : 0} size={SIZE}></ViewGrid> : null }
        </div>
      </div>
    </div>
  );
}

export default Board;
export {
  GridType
}