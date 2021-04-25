import React, { useState, useEffect, useRef } from 'react';
import useGrid, { Box } from './../../hooks/useGrid';

interface Props {
  size: number;
  tileSize: number;
}

const DragGrid = ({ size, tileSize }: Props) => {
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

  
  useEffect(() => resize(), [tileSize]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const grid = useGrid(size, box);

  return (
    <div ref={div}>
      {grid.map((v, i) => {
        return (
          <div 
            style={{width: `${tileSize}px`, height: `${tileSize}px`, backgroundColor: v > 99 ? 'gold' : 'transparent'}}
            className="tile"
            key={'grid-' + i}
          >
          {/* {v != 0 ? v : null} */}
          </div>
        )
      })}
    </div>
  );
}

export default DragGrid;