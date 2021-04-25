import React, { useState, useEffect, useRef, createRef } from 'react';

interface Props {
  size: number;
  tileSize: number;
}

interface TileProps {
  value: TileState;
}

enum TileState {
  Empty,
  Miss,
  Hit,
  PartialHit,
}

const Tile = ({ value }: TileProps) => {
  switch (value) {
    case TileState.Empty:
      return <button className="tile-state-empty"></button>;
    case TileState.Miss:
      return (
        <div className="tile-state-miss">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </div>
      );
    case TileState.Hit:
      return <div className="tile-state-hit"><div></div></div>;
    case TileState.PartialHit:
      return <div>?</div>;
    default:
      return <div></div>;
  }
}

const Grid = ({ size, tileSize }: Props) => {
  const [grid, setGrid] = useState<TileState[]>((new Array(size * size)).fill(TileState.Empty));

  useEffect(() => {
    grid[32] = TileState.Hit;
    grid[44] = TileState.Miss;
    setGrid([...grid]);
  }, []);

  const handler = (idx: number) => {
    grid[idx] = TileState.Hit;
    setGrid([...grid]);
  }
  
  return (
    <div>
      {grid.map((v, i) => {
        return (
          <div 
            style={{width: `${tileSize}px`, height: `${tileSize}px`}}
            className="tile"
            key={'grid-' + i}
            onClick={() => handler(i)}
          >
            <Tile value={v}></Tile>
          </div>
        )
      })}
    </div>
  );
}

export default Grid;