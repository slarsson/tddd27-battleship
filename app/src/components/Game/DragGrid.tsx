import React, { useState, useEffect, useRef, createRef } from 'react';

import useGrid, { Box } from './../../hooks/useGrid';

interface Props {
  size: number;
  tileSize: number;
}

// interface Box {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

const DragGrid = ({ size, tileSize }: Props) => {
  //const [grid, setGrid] = useState<number[]>((new Array(size * size)).fill(-1));
  const [box, setBox] = useState<Box>({x: 0, y: 0, width: 0, height: 0});

  const div = useRef<HTMLDivElement | null>(null);
  const resize = () => {
    if (div.current) {
      setBox({
        x: div.current.offsetLeft,
        y: div.current.offsetTop,
        width: div.current.clientWidth,
        height: div.current.clientHeight
      });
    }
  };

  const grid = useGrid(size, box);

  useEffect(() => {
    resize();
  }, [tileSize]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <>
    {/* <div 
      style={{
        width: `${box.width}px`,
        height: `${box.height}px`,
        top: `${box.y}px`,
        left: `${box.x}px`,
        position: 'absolute',
        border: '1px solid blue'
      }}
    >
      asdf
    </div> */}

    <div ref={div}>
      {grid.map((v, i) => {
        return (
          <div 
            style={{width: `${tileSize}px`, height: `${tileSize}px`, backgroundColor: v > 99 ? 'gold' : 'transparent'}}
            className="tile"
            key={'grid-' + i}
          >
          {v != 0 ? v : null}
          </div>
        )
      })}
    </div>
    </>
  );
}

export default DragGrid;