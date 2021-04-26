import React, { useState, useEffect, useRef } from 'react';
import useGrid, { Box } from './../../hooks/useGrid';

import { useRecoilState } from 'recoil';
import { tileSizeState } from './state';

interface Props {
  size: number;
  tileSize: number;
}

const DragGrid = ({ size, tileSize }: Props) => {
  const [r_tileSize, r_setTileSize] = useRecoilState<number>(tileSizeState);

  
  const [box, setBox] = useState<Box>({x: 0, y: 0, width: 0, height: 0});
  const div = useRef<HTMLDivElement | null>(null);
  const resize = () => {
    console.log('left:', div.current?.offsetTop);
    if (div.current) {
      setBox({
        x: div.current.getBoundingClientRect().left,
        y: div.current.offsetTop,
        width: div.current.clientWidth,
        height: div.current.clientHeight
      });
    }
  };

  //useEffect(() => resize(), [tileSize]);

  // useEffect(() => {
  //   window.addEventListener('resize', resize);
  //   return () => window.removeEventListener('resize', resize);
  // }, []);


  useEffect(() => {
    r_setTileSize(tileSize);
    resize();
  }, [tileSize]);

  // TODO: fix this!!!
  useEffect(() => {
    setTimeout(() => {
      resize();
    }, 200);
  }, []);;

  const grid = useGrid(size, box);

  return (
    <div ref={div} style={{outline: 'none'}}>
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