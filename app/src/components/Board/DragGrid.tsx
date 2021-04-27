import React, { useState, useEffect, useRef } from 'react';
import useGrid, { Box } from './../../hooks/useGrid';

import { useRecoilState } from 'recoil';
import { tileSizeState } from './state';

interface Props {
  size: number;
  tileSize: number;
}

const DragGrid = ({ size, tileSize }: Props) => {
  //const [r_tileSize, r_setTileSize] = useRecoilState<number>(tileSizeState); 
  const [box, setBox] = useState<Box>({x: 0, y: 0, width: 0, height: 0});
  const div = useRef<HTMLDivElement | null>(null);

  const resize = () => {
    if (div.current) {
      setBox({
        x: div.current.getBoundingClientRect().left,
        y: div.current.offsetTop,
        width: div.current.clientWidth,
        height: div.current.clientHeight
      });
    }
  };

  useEffect(() => {
    //r_setTileSize(tileSize);
    resize();
  }, [tileSize]);

  // This is stupid. But it works.
  // Used to fix 1px offset when the div has changed position.
  useEffect(() => {
    let itrv = setInterval(() => resize(), 500);
    return () => clearInterval(itrv);
  }, []);

  const grid = useGrid(size, box);

  return (
    <div ref={div} style={{outline: 'none'}}>
      {grid.map((v, i) => {
        return (
          <div 
            style={{width: `${tileSize}px`, height: `${tileSize}px`, backgroundColor: v > 99 ? '#BEF264' : 'transparent'}}
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