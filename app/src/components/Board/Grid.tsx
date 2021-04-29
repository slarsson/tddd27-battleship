import React, { useState, useEffect, useRef, createRef } from 'react';

interface Props {
  size: number;
  tileSize: number;
  grid?: TileState[];
  handler?: (index: number, value: TileState) => void;
}

interface TileProps {
  value: TileState;
  index: number;
  handler?: (index: number, value: TileState) => void;
}

export enum TileState {
  None,
  Empty,
  Miss,
  Hit,
  PartialHit,
  Loading
}

const Tile = ({ value, index, handler }: TileProps) => {
  const onClick = () => {
    if (handler) handler(index, value);
  };
  
  // switch (value) {
  //   case TileState.Empty:
  //     return <button className="tile-state-empty" onClick={onClick}></button>;
  //   case TileState.Miss:
  //     return (
  //       <div className="tile-state-miss">
  //         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
  //       </div>
  //     );
  //   case TileState.Hit:
  //     return <div className="tile-state-hit"><div></div></div>;
  //   case TileState.PartialHit:
  //     return <div>?</div>;
  //   case TileState.Loading:
  //     return <div className="waiting"></div>
  //   default:
  //     return <div></div>;
  // }

  switch (value) {
      case 0:
        return <button className="tile-state-empty" onClick={onClick}></button>;
      case 1:
        return (
          <div className="tile-state-miss">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
        );
      default:
        return <div></div>;
    }
}

const Grid = ({ size, tileSize, grid, handler }: Props) => {
  const [localGrid, setLocalGrid] = useState<TileState[]>(grid != undefined ? grid : (new Array(size * size)).fill(TileState.Empty));
  const key = useRef<string>(Math.random().toString(36).substring(5));

  useEffect(() => {
    if (grid) {
      setLocalGrid([...grid]);
    }
  }, [grid]);

  return (
    <div>
      {localGrid.map((v, i) => {
        return (
          <div 
            style={{width: `${tileSize}px`, height: `${tileSize}px`}}
            className="tile"
            key={key + 'grid-' + i}
          >
            <Tile value={v} index={i} handler={handler}></Tile>
          </div>
        )
      })}
    </div>
  );
}

export default Grid;