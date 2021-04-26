import React, { useEffect, useState } from 'react';
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
  maxWidth?: number;
}

const SIZE = 10;
const alpha = 'ABCDEFGHIJKLMNOPQRST';

const sizeFromWindowHeight = () => {
  
  
  console.log(window.innerWidth);
  
  return Math.trunc((window.innerHeight * 0.4) / (SIZE + 1));
};

const sizeFromWidth = (w: number) => {
  return Math.trunc(Math.min(w, 600) / (SIZE + 1));
};

const Board = ({ type, maxWidth }: Props) => {
  const [tileSize, setTileSize] = useState<number>(maxWidth == null ? sizeFromWindowHeight() : sizeFromWidth(maxWidth));

  const [r_tileSize, r_setTileSize] = useRecoilState<number>(tileSizeState);
  
  const resize = () => {
    let size: number;
    if (maxWidth != undefined) {
      size = sizeFromWidth(maxWidth);
    } else {
      size = sizeFromWindowHeight();
    }
    r_setTileSize(size);
    setTileSize(size);
  };

  useEffect(() => resize(), [maxWidth]);

  let tileStyle = {width: `${tileSize}px`, height: `${tileSize}px`};

  return (
    <div className="board" style={{width: `${tileSize * 11 + 1}px`}}>
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
          {type == GridType.View ? <ViewGrid tileSize={tileSize} size={SIZE}></ViewGrid> : null }
        </div>
      </div>
    </div>
  );
}

export default Board;
export {
  GridType
}