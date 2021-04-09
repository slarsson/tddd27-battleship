import React, { useState, useEffect, useRef, createRef } from "react";

import useGrid, { Grid } from './useGrid';


import "./test.scss";
const Drag = () => {
  const [ss, setSS] = useState<number>(40);
  const [grid, setGrid] = useState<Grid>({
    x: 100,
    y: 100,
    size: 20,
  });

  let gridDiv = createRef<HTMLDivElement>();

  const fakenews = useGrid(ss, grid, [
    { size: 2, horizontal: true, originX: 0, originY: 0 },
    { size: 5, horizontal: true, originX: 0, originY: 0 },
    { size: 3, horizontal: false, originX: 0, originY: 0 },
    { size: 1, horizontal: true, originX: 0, originY: 0 },
    { size: 2, horizontal: true, originX: 0, originY: 0 },
    { size: 5, horizontal: true, originX: 0, originY: 0 },
    { size: 3, horizontal: false, originX: 0, originY: 0 },
    { size: 1, horizontal: true, originX: 0, originY: 0 }
  ]);

  useEffect(() => {
    if (gridDiv.current) {
      grid.x = gridDiv.current.offsetLeft;
      grid.y = gridDiv.current.offsetTop;
    }

    setGrid({ ...grid });
    console.log(gridDiv.current?.offsetLeft);
    console.log(gridDiv.current?.offsetTop);
  }, []);

  return (
    <div
      className="drag"
      ref={gridDiv}
      style={{ width: ss * grid.size, height: ss * grid.size }}
    >
      {fakenews.items.map((item, i) => {
        return (
          <div
            key={"wtf" + i}
            className="item"
            style={{
              width: item.width + "px",
              height: item.height + "px",
              left: item.x,
              top: item.y,
              transform: `rotate(${item.rotation}deg)`,
              transition: item.transition,
            }}
          >
            
          </div>
        );
      })}

      <div className="my-grid">
        {fakenews.grid.map((item, i) => {
          return (
            <div
              key={i}
              style={{
                //backgroundColor: `rgb(${Math.random() * 255}, 1, 1)`,
                width: ss + "px",
                height: ss + "px",
                backgroundColor: item == 1 ? "lightgreen" : "blue",
              }}
            >
              {item > 1 ? item : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Drag;