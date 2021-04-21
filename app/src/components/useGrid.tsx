import { useState, useEffect, useRef } from "react";

export interface Item {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
  rotation: number;
  transition: string;
  id: number;
}

export interface Dimensions {
  size: number;
  horizontal: boolean;
  originX: number;
  originY: number;
}

export interface Grid {
  x: number;
  y: number;
  size: number;
}

export const GRID_EMPTY = 0;
export const GRID_HOVER = 1;
const TRANSITION_SNAP = 'left 0.1s ease-out, top 0.1s ease-out';
const TRANSITION_ORIGIN = 'left 0.2s ease-out, top 0.2s ease-out';

const useGrid = (
  size: number,
  gridDimensions: Grid,
  dimensions: Dimensions[]
) => {
  const [items, setItems] = useState<Item[]>([]);
  const [_grid, setGrid] = useState<number[]>(new Array(gridDimensions.size * gridDimensions.size).fill(0));

  const target = useRef<number>(-1);
  const itemData = useRef<Item[]>(items);
  const grid = useRef<number[]>(_grid);

  useEffect(() => {
    itemData.current = items.map((v) => {
      return { ...v };
    });
  }, [items]);

  useEffect(() => {
    grid.current = [..._grid];
  }, [_grid]);

  // mousemove
  const action = (evt: MouseEvent) => {
    if (target.current < 0) return;

    setItems(
      itemData.current.map((v, i) => {
        if (i == target.current) {
          v.x = evt.pageX - v.offsetX;
          v.y = evt.pageY - v.offsetY;
        }
        return { ...v };
      })
    );

    let itemcx = itemData.current[target.current].x + itemData.current[target.current].width * 0.5;
    let itemcy = itemData.current[target.current].y + itemData.current[target.current].height * 0.5;

    let min = Infinity;
    let bestChoice = -1;
    for (let i = 0; i < grid.current.length; i++) {
      let row = Math.trunc(i / gridDimensions.size);
      let col = i % gridDimensions.size;
      let cx = gridDimensions.x + size * 0.5 + size * col;
      let cy = gridDimensions.y + size * 0.5 + size * row;
      let len = Math.abs(cx - itemcx) + Math.abs(cy - itemcy);
      if (len < min) {
        min = len;
        bestChoice = i;
      }
    }

    for (let i = 0; i < grid.current.length; i++) {
      if (grid.current[i] != GRID_HOVER) continue;
      grid.current[i] = GRID_EMPTY;
    }

    let collision = false;

    // x-axis
    let w = dimensions[target.current].horizontal ? dimensions[target.current].size : 1;
    let start = bestChoice - Math.trunc(w / 2);
    for (let i = 0; i < w; i++) {
      let index = start + i;
      if (index < 0 || index >= gridDimensions.size * gridDimensions.size) continue;
      if (grid.current[index] > GRID_HOVER) {
        collision = true;
        break;
      }
      grid.current[index] = GRID_HOVER;
    }

    let h = dimensions[target.current].horizontal ? 1 : dimensions[target.current].size;
    start = bestChoice - gridDimensions.size * Math.trunc(h / 2);
    for (let i = 0; i < h; i++) {
      let index = start + gridDimensions.size * i;
      if (index < 0 || index >= gridDimensions.size * gridDimensions.size) continue;
      if (grid.current[index] > GRID_HOVER && grid.current[index] != GRID_HOVER) {
        collision = true;
        break;
      }
      grid.current[index] = GRID_HOVER;
    }

    if (collision) {
      for (let i = 0; i < grid.current.length; i++) {
        if (grid.current[i] > GRID_HOVER) continue;
        grid.current[i] = GRID_EMPTY;
      }
    }

    setGrid(grid.current);
  };

  // mousedown
  const attach = (evt: MouseEvent) => {
    let index = -1;
    for (let i = 0; i < itemData.current.length; i++) {
      if (
        evt.pageX <= itemData.current[i].x + itemData.current[i].width &&
        evt.pageX >= itemData.current[i].x &&
        evt.pageY <= itemData.current[i].y + itemData.current[i].height &&
        evt.pageY >= itemData.current[i].y
      ) {
        index = i;
        itemData.current[i].transition = '';
        itemData.current[i].offsetX = evt.pageX - itemData.current[i].x;
        itemData.current[i].offsetY = evt.pageY - itemData.current[i].y;
        break;
      }
    }

    if (index < 0) return;
    target.current = index;

    let id = itemData.current[target.current].id;
    for (let i = 0; i < grid.current.length; i++) {
      if (grid.current[i] == id) {
        grid.current[i] = GRID_EMPTY;
      }
    }

    setGrid(grid.current);
    setItems(itemData.current);
  };

  // mouseup
  const detach = (evt: MouseEvent) => {
    if (target.current < 0) return;

    let itemcx = itemData.current[target.current].x + itemData.current[target.current].width * 0.5;
    let itemcy = itemData.current[target.current].y + itemData.current[target.current].height * 0.5;

    let min = Infinity;
    let bestChoice = { index: -1, x: 0, y: 0 };
    for (let i = 0; i < grid.current.length; i++) {
      let row = Math.trunc(i / gridDimensions.size);
      let col = i % gridDimensions.size;
      let cx = gridDimensions.x + size * 0.5 + size * col;
      let cy = gridDimensions.y + size * 0.5 + size * row;

      let len = Math.abs(cx - itemcx) + Math.abs(cy - itemcy);
      if (len < min) {
        min = len;
        bestChoice.index = i;
        bestChoice.x = cx;
        bestChoice.y = cy;
      }
    }

    let w = dimensions[target.current].horizontal ? dimensions[target.current].size : 1;
    let h = dimensions[target.current].horizontal ? 1 : dimensions[target.current].size;
    
    let x = Math.trunc(w * 0.5) * size + size * 0.5;
    let y = Math.trunc(h * 0.5) * size + size * 0.5;

    itemData.current[target.current].x = bestChoice.x - x;
    itemData.current[target.current].y = bestChoice.y - y;
    itemData.current[target.current].transition = TRANSITION_SNAP;
    
    for (let i = 0; i < grid.current.length; i++) {
      if (grid.current[i] == GRID_HOVER) {
        grid.current[i] = GRID_EMPTY;
      }
    }

    let collision = false;

    // x-axis
    let start = bestChoice.index - Math.trunc(w / 2);
    let row = Math.trunc(start / gridDimensions.size);
    for (let i = 0; i < w; i++) {
      let index = start + i;
      if (grid.current[index] > 1 || row != Math.trunc(index / gridDimensions.size)) {
        collision = true;
        break;
      }
      if (index < 0 || index >= gridDimensions.size * gridDimensions.size) continue;
      grid.current[index] = itemData.current[target.current].id;
    }

    // y-axis
    start = bestChoice.index - gridDimensions.size * Math.trunc(h / 2);  
    let col = start % gridDimensions.size;
    for (let i = 0; i < h; i++) {
      let index = start + gridDimensions.size * i;
      if ((grid.current[index] > 1 && grid.current[index] != itemData.current[target.current].id) || col != index % gridDimensions.size) {
        collision = true;
        break;
      }
      if (index < 0 || index >= gridDimensions.size * gridDimensions.size) continue;
      grid.current[index] = itemData.current[target.current].id;
    }

    if (collision) {   
      for (let i = 0; i < grid.current.length; i++) {
        if (grid.current[i] == GRID_HOVER || grid.current[i] == itemData.current[target.current].id) {
          grid.current[i] = GRID_EMPTY;
        }
      }

      itemData.current[target.current].x = itemData.current[target.current].originX; 
      itemData.current[target.current].y = itemData.current[target.current].originY;
      itemData.current[target.current].transition = TRANSITION_ORIGIN;
    }

    setGrid(grid.current);
    setItems(itemData.current);
    target.current = -1;
  };

  useEffect(() => {
    let _items: Item[] = [];
    let i = 0;
    for (let row of dimensions) {
      let width = 1;
      let height = 1;
      if (row.horizontal) {
        width = row.size;
      } else {
        height = row.size;
      }
      
      _items.push({
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        originX: row.originX,
        originY: row.originY,
        width: width * size,
        height: height * size,
        rotation: 0,
        transition: "",
        id: 100 + i,
      });
      i++;
    }

    setItems(_items);

    document.addEventListener("mousemove", action);
    document.addEventListener("mousedown", attach);
    document.addEventListener("mouseup", detach);
    return () => {
      document.removeEventListener("mousemove", action);
      document.removeEventListener("mousedown", attach);
      document.removeEventListener("mouseup", detach);
    };
  }, []);

  useEffect(() => {
    // TODO: update when size change
    let _items: Item[] = [];
    let i = 0;
    for (let row of dimensions) {
      let width = 1;
      let height = 1;
      if (row.horizontal) {
        width = row.size;
      } else {
        height = row.size;
      }
      
      _items.push({
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        originX: row.originX,
        originY: row.originY,
        width: width * size,
        height: height * size,
        rotation: 0,
        transition: "",
        id: 100 + i,
      });
      i++;
    }

    setItems(_items);
  }, [size]);

  return { items: items, grid: _grid };
};

export default useGrid;
