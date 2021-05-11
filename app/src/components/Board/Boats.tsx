import React from 'react';
import { useRecoilValue } from 'recoil';
import { tileSizeState, boatsState } from './state';

interface Boat {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  mouseOffsetX: number;
  mouseOffsetY: number;
  move: boolean;
  transition: string;
}

const Boats = () => {
  const tileSize = useRecoilValue(tileSizeState);
  const boats = useRecoilValue(boatsState);

  return (
    <div style={{ top: 0, left: 0, position: 'absolute' }}>
      {boats.map((b, i) => {
        return (
          <div
            key={'boatz' + i}
            className="boat"
            style={{
              width: `${b.width * tileSize - 1}px`,
              height: `${b.height * tileSize - 1}px`,
              top: `${b.y}px`,
              left: `${b.x}px`,
              transition: b.transition,
              position: 'absolute',
              boxShadow: b.move ? '0px 0px 10px 5px rgba(250, 250, 250, .4)' : 'none',
              zIndex: b.move ? 9999 : 0,
            }}
          >
            {/* {b.x} - {b.y} */}
          </div>
        );
      })}
    </div>
  );
};

export default Boats;
export type { Boat };
