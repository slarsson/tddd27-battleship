import React, { useState, useEffect, useRef, createRef } from "react";

import "./test.scss";

interface Position {
  x: number;
  y: number;
}

const Drag = () => {
  const [ss, setSS] = useState<number>(50);
  const [grid, setGrid] = useState<Grid>({
    x: 0,
    y: 0,
    size: 10,
  });

  let gridDiv = createRef<HTMLDivElement>();

  const fakenews = useFakeNews(ss, grid, [
    { width: 1, height: 5 },
    { width: 5, height: 1 },
    { width: 4, height: 1 },
    { width: 1, height: 2 },
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
            asdf-{i}
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
            ></div>
          );
        })}
      </div>
    </div>
  );
};

interface Item {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  rotation: number;
  transition: string;
  id: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Grid {
  x: number;
  y: number;
  size: number;
}

const useFakeNews = (size: number, _grid: Grid, dimensions: Dimensions[]) => {
  const [items, setItems] = useState<Item[]>([]);
  const [grid, setGrid] = useState<number[]>(
    new Array(_grid.size * _grid.size).fill(0)
  );
  const target = useRef<number>(-1);

  // const [news, setNews] = useState("ggwp");

  const realItems = useRef<Item[]>(items);

  useEffect(() => {
    realItems.current = items.map((itm) => {
      return { ...itm };
    });
  }, [items]);

  const action = (evt: MouseEvent) => {
    if (target.current < 0) return;
    setItems(
      realItems.current.map((v, i) => {
        if (i == target.current) {
          v.x = evt.pageX - v.offsetX;
          v.y = evt.pageY - v.offsetY;
        }
        return { ...v };
      })
    );

    let itemcx =
      realItems.current[target.current].x +
      realItems.current[target.current].width * 0.5;
    let itemcy =
      realItems.current[target.current].y +
      realItems.current[target.current].height * 0.5;

    let left = 100;
    let top = 100;

    let min = Infinity;
    let best = -1;
    for (let i = 0; i < grid.length; i++) {
      let row = Math.trunc(i / _grid.size);
      let col = i % _grid.size;

      let cx = left + size * 0.5 + size * col;
      let cy = top + size * 0.5 + size * row;

      let len = Math.abs(cx - itemcx) + Math.abs(cy - itemcy);

      if (len < min) {
        min = len;
        best = i;
      }

      //grid[i] = cx;
      //grid[i] = cy;

      // let row = i % _grid.size;
      // let col = row * _grid.size - i;
      // let gx1 = left + size * row;
      // let gx2 = gx1 + size;
      // if (x1 > gx2 || gx1 > x2) {
      //   grid[i] = 0;
      //   continue;
      // }
      // // let gy1 = top + size + size * col;
      // // if (y2 < gy1) {
      // //   grid[i] = 0;
      // //   continue;
      // // }
      // grid[i] = 1;
      // if (x1 < gx1) {
      //   grid[i] = 1;
      // } else {
      //   grid[i] = 0;
      // }
    }

    //let index = [best];

    for (let i = 0; i < grid.length; i++) {
      grid[i] = 0;
    }

    let nx = dimensions[target.current].width;
    let start = best - Math.trunc(nx / 2);
    for (let i = 0; i < nx; i++) {
      let index = start + i;
      if (index < 0 || index >= _grid.size * _grid.size) continue;
      grid[index] = 1;
    }

    let ny = dimensions[target.current].height;
    start = best - _grid.size * Math.trunc(ny / 2);
    for (let i = 0; i < ny; i++) {
      let index = start + _grid.size * i;
      if (index < 0 || index >= _grid.size * _grid.size) continue;
      grid[index] = 1;
    }

    setGrid(grid);
  };

  const attach = (evt: MouseEvent) => {
    //console.log(realItems.current.length);

    let index = -1;
    for (let i = 0; i < realItems.current.length; i++) {
      if (
        evt.pageX <= realItems.current[i].x + realItems.current[i].width &&
        evt.pageX >= realItems.current[i].x &&
        evt.pageY <= realItems.current[i].y + realItems.current[i].height &&
        evt.pageY >= realItems.current[i].y
      ) {
        index = i;
        realItems.current[i].transition = "";
        realItems.current[i].offsetX = evt.pageX - realItems.current[i].x;
        realItems.current[i].offsetY = evt.pageY - realItems.current[i].y;
      }
    }

    if (index < 0) return;
    target.current = index;
    setItems(realItems.current);
  };

  const detach = (evt: MouseEvent) => {
    if (target.current < 0) return;
    let reset = false;

    // let x1 = realItems.current[target.current].x;
    // let x2 =
    //   realItems.current[target.current].x +
    //   realItems.current[target.current].width;
    // let y1 = realItems.current[target.current].y;
    // let y2 =
    //   realItems.current[target.current].y +
    //   realItems.current[target.current].height;

    // for (let i = 0; i < realItems.current.length; i++) {
    //   if (i == target.current) continue;

    //   // x-axis
    //   if (
    //     x1 > realItems.current[i].x + realItems.current[i].width ||
    //     x2 < realItems.current[i].x
    //   ) {
    //     continue;
    //   }

    //   // y-axis
    //   if (
    //     y1 > realItems.current[i].y + realItems.current[i].height ||
    //     y2 < realItems.current[i].y
    //   ) {
    //     continue;
    //   }
    //   reset = true;
    //   break;
    // }

    if (reset) {
      realItems.current[target.current].x = 1200;
      realItems.current[target.current].y = 100;
      realItems.current[target.current].transition =
        "left 0.2s ease-out, top 0.2s ease-out";
      setItems(realItems.current);
    } else {
      let itemcx =
        realItems.current[target.current].x +
        realItems.current[target.current].width * 0.5;
      let itemcy =
        realItems.current[target.current].y +
        realItems.current[target.current].height * 0.5;

      let left = 100;
      let top = 100;

      let min = Infinity;
      let best = { x: 0, y: 0 };
      for (let i = 0; i < grid.length; i++) {
        let row = Math.trunc(i / _grid.size);
        let col = i % _grid.size;

        let cx = left + size * 0.5 + size * col;
        let cy = top + size * 0.5 + size * row;

        let len = Math.abs(cx - itemcx) + Math.abs(cy - itemcy);

        if (len < min) {
          min = len;
          best.x = cx;
          best.y = cy;
        }
      }

      let nx =
        Math.trunc(dimensions[target.current].width * 0.5) * size + size * 0.5;
      let ny =
        Math.trunc(dimensions[target.current].height * 0.5) * size + size * 0.5;

      realItems.current[target.current].x = best.x - nx;
      realItems.current[target.current].y = best.y - ny;
      realItems.current[target.current].transition =
        "left 0.1s ease-out, top 0.1s ease-out";
      setItems(realItems.current);
    }

    target.current = -1;
  };

  const keypress = (evt: KeyboardEvent) => {
    if (target.current < 0) return;
    // TODO: fix this!
    // if (evt.key == "ArrowLeft") {
    //   realItems.current[target.current].rotation += 90;
    // } else if (evt.key == "ArrowRight") {
    //   realItems.current[target.current].rotation -= 90;
    // }
    // setItems(realItems.current);
  };

  useEffect(() => {
    let _items: Item[] = [];
    let i = 0;
    for (let row of dimensions) {
      _items.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        offsetX: 0,
        offsetY: 0,
        width: row.width * size,
        height: row.height * size,
        rotation: 0,
        transition: "",
        id: i,
      });
      i++;
    }

    setItems(_items);

    // let myItems: Item[] = [];
    // for (let i = 0; i < 3; i++) {
    //   myItems.push({
    //     x: Math.random() * 1000,
    //     y: Math.random() * 600,
    //     rotation: 0,
    //     transition: "",
    //     _id: "item-" + i,
    //   });
    // }

    // myItems[1].rotation = 90;

    // setItems(myItems);

    //mouseDown.current = false;
    document.addEventListener("mousemove", action);
    document.addEventListener("mousedown", attach);
    document.addEventListener("mouseup", detach);
    document.addEventListener("keydown", keypress);
    return () => {
      document.removeEventListener("mousemove", action);
      document.removeEventListener("mousedown", attach);
      document.removeEventListener("mouseup", detach);
      document.removeEventListener("keydown", keypress);
    };
  }, []);

  useEffect(() => {
    let _items: Item[] = [];
    let i = 0;
    for (let row of dimensions) {
      _items.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        offsetX: 0,
        offsetY: 0,
        width: row.width * size,
        height: row.height * size,
        rotation: 0,
        transition: "",
        id: i,
      });
      i++;
    }

    setItems(_items);
  }, [size]);
  return { items, grid };
};

export default Drag;
