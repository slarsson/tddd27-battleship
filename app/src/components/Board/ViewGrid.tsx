import React, { useState, useEffect, useRef, createRef } from 'react';

interface Props {
  size: number;
  tileSize: number;
}

const ViewGrid = ({ size, tileSize }: Props) => {
  const [grid, setGrid] = useState<number[]>((new Array(size * size)).fill(0));
  
  return (
    <div>
      {grid.map((v, i) => {
        return (
          <div 
            style={{width: `${tileSize}px`, height: `${tileSize}px`}}
            className="tile"
            key={'view-grid-' + i}
          >
            
          </div>
        )
      })}
    </div>
  );
}

export default ViewGrid;