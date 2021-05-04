import React, { useState, useEffect, useRef, createRef } from 'react';
import { TileState } from '../../../../interfaces';

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
      case TileState.Empty:
        return <div></div>;
      
      case TileState.Available:
        return <button className="tile-state-empty" onClick={onClick}></button>;
      
      case TileState.Miss:
        return (
          <div className="tile-state-miss">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
        );

      case TileState.Hit:
        return (
          <div className="tile-state-hit">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" y="0"/></g><g><path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z"/></g></svg>
          </div>
        );

      case TileState.HitOnBoat:
        return (
          <div className="tile-state-hit tile-state-boat">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" y="0"/></g><g><path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z"/></g></svg>
          </div>
        );

      case TileState.Loading:
        return <div className="tile-state-loading"></div>;

      default:
        if (value >= 100) {
          return <div className="tile-state-boat"></div>;
        } 
        return <div>X</div>;
        
      
      
      
      
      // case 1:
      //   return (
      //     <div className="tile-state-miss">
      //       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      //     </div>
      //   );
      // default:
      //   if (value >= 100) {
      //     return <div style={{ backgroundColor: 'orange'}}></div>;
      //   }
      //   return <div></div>;
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