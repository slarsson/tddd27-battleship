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
  test?: number;
}

const SIZE = 10;
const MAX_TILE_WIDTH = 60;
const alpha = 'ABCDEFGHIJKLMNOPQRST';

const Board = ({ type, test }: Props) => {
  
  
  const [tileSize, setTileSize] = useState<number>((window.innerHeight * 0.4) / (SIZE + 1));
  
  // useEffect(() => {
  //   r_setTileSize(tileSize);
  // }, [tileSize]);

  const [r_tileSize, r_setTileSize] = useRecoilState<number>(tileSizeState);
  
  const resize = () => {
    
    //console.log('reisze shiet')
    
    if (test != undefined) {
      console.log('set to test', test);
      setTileSize(test);
      return;
    }

    const s = (window.innerHeight * 0.4) / (SIZE + 1);
    console.log(s);
    r_setTileSize(s);
    setTileSize(s);
  };

  useEffect(() => {
    console.log('test update..', test);
    resize();
  }, [test]);

  // useEffect(() => {
  //   resize();
  //   window.addEventListener('resize', () => resize()); // TODO: how to remove this?
  //   return () => window.removeEventListener('resize', () => resize());
  // }, []);

  let tileStyle = {width: `${tileSize}px`, height: `${tileSize}px`};

  return (
    <div className="board" style={{maxWidth: `${MAX_TILE_WIDTH * SIZE}px`, width: `${tileSize * 11 + 1}px`}}>
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