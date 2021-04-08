import React, { useState, useEffect, useRef } from "react";

import "./test.scss";

interface Position {
  x: number;
  y: number;
}

const Drag = () => {
  const [ss, setSS] = useState<number>(50);

  const fakenews = useFakeNews(ss, [
    { width: 1, height: 5 },
    { width: 6, height: 1 },
    { width: 2, height: 4 },
  ]);

  // useEffect(() => {
  //   setInterval(() => {
  //     let v = Math.random() * 100;
  //     console.log(v);
  //     setSS(v);
  //   }, 1000);
  // }, []);

  const [position, setPosition] = useState<Position>({ x: 1150, y: 100 });
  const [rotation, setRotation] = useState<number>(0);
  const [transition, setTransition] = useState<string>("");

  const mouseDown = useRef<boolean>(false);
  const newPosition = useRef<Position>(position);
  const currentRotation = useRef<number>(rotation);
  const div = useRef<HTMLDivElement>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });

  // useEffect(() => {
  //   newPosition.current = position;
  // }, [position]);

  // useEffect(() => {
  //   currentRotation.current = rotation;
  // }, [rotation]);

  // const action = (evt: MouseEvent) => {
  //   if (!mouseDown.current) return;
  //   setTransition("");
  //   setPosition({
  //     x: evt.pageX - offset.current.x,
  //     y: evt.pageY - offset.current.y,
  //   });
  // };

  // const attach = (evt: MouseEvent) => {
  //   if (!div.current) return;
  //   const dimensions = div.current.getBoundingClientRect();

  //   if (
  //     evt.pageX < dimensions.left ||
  //     evt.pageX > dimensions.left + dimensions.width ||
  //     evt.pageY < dimensions.top ||
  //     evt.pageY > dimensions.top + dimensions.height
  //   ) {
  //     return;
  //   }

  //   offset.current = {
  //     x: evt.pageX - div.current.offsetLeft, // use div-ref since it does not care about rotation
  //     y: evt.pageY - div.current.offsetTop,
  //   };
  //   mouseDown.current = true;
  // };

  // const detache = (evt: MouseEvent) => {
  //   if (!mouseDown.current) return;
  //   mouseDown.current = false;
  //   if (
  //     evt.pageX > 1200 ||
  //     evt.pageX < 100 ||
  //     evt.pageY < 100 ||
  //     evt.pageY > 1000
  //   ) {
  //     setTransition("left 0.2s ease-out, top 0.2s ease-out");
  //     setPosition({ x: 1150, y: 100 });
  //   }
  // };

  // const keypress = (evt: KeyboardEvent) => {
  //   if (evt.key == "ArrowLeft") {
  //     setRotation(currentRotation.current + 90);
  //   } else if (evt.key == "ArrowRight") {
  //     setRotation(currentRotation.current - 90);
  //   }
  // };

  // useEffect(() => {
  //   mouseDown.current = false;
  //   document.addEventListener("mousemove", action);
  //   document.addEventListener("mousedown", attach);
  //   document.addEventListener("mouseup", detache);
  //   document.addEventListener("keydown", keypress);
  //   return () => {
  //     document.removeEventListener("mousemove", action);
  //     document.removeEventListener("mousedown", attach);
  //     document.removeEventListener("mouseup", detache);
  //     document.removeEventListener("keydown", keypress);
  //   };
  // }, []);

  // return (
  //   <div className="drag">
  //     <div
  //       ref={div}
  //       className="item"
  //       style={{
  //         left: position.x,
  //         top: position.y,
  //         transition: transition,
  //         transform: `rotate(${rotation}deg)`,
  //       }}
  //     >
  //       x: {position.x}, y: {position.y}
  //       {JSON.stringify(fakenews)}
  //     </div>
  //   </div>
  // );

  return (
    <div className="drag">
      {fakenews.map((item, i) => {
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

const useFakeNews = (size: number, dimensions: Dimensions[]) => {
  const [items, setItems] = useState<Item[]>([]);

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

    // realItems.current[targetItem.id].offsetX =
    //   evt.pageX - realItems.current[targetItem.id].x;
    // realItems.current[targetItem.id].offsetY =
    //   evt.pageY - realItems.current[targetItem.id].y;
    setItems(realItems.current);

    // let targetItem: Item | null = null;
    // for (let boat of realItems.current) {
    //   if (
    //     evt.pageX <= boat.x + boat.width &&
    //     evt.pageX >= boat.x &&
    //     evt.pageY <= boat.y + boat.height &&
    //     evt.pageY >= boat.y
    //   ) {
    //     targetItem = boat;
    //     break;
    //   }
    // }

    // if (!targetItem) return;
    // target.current = targetItem.id;

    // realItems.current[targetItem.id].offsetX =
    //   evt.pageX - realItems.current[targetItem.id].x;
    // realItems.current[targetItem.id].offsetY =
    //   evt.pageY - realItems.current[targetItem.id].y;
    // setItems(realItems.current);

    //console.log("FOUND BOAT", targetItem.id);

    // console.log(evt.pageX);
    // let swag = items.map((v) => {
    //   v.x = Math.random() * 1000;
    //   v.y = Math.random() * 500;
    //   return { ...v };
    // });
    // setItems(swag);
    // target.current++;
    // if (target.current > items.length) {
    //   target.current = 0;
    // }
  };

  const detach = (evt: MouseEvent) => {
    if (target.current < 0) return;
    let reset = false;

    let x1 = realItems.current[target.current].x;
    let x2 =
      realItems.current[target.current].x +
      realItems.current[target.current].width;
    let y1 = realItems.current[target.current].y;
    let y2 =
      realItems.current[target.current].y +
      realItems.current[target.current].height;

    for (let i = 0; i < realItems.current.length; i++) {
      if (i == target.current) continue;

      // x-axis
      if (
        x1 > realItems.current[i].x + realItems.current[i].width ||
        x2 < realItems.current[i].x
      ) {
        continue;
      }

      // y-axis
      if (
        y1 > realItems.current[i].y + realItems.current[i].height ||
        y2 < realItems.current[i].y
      ) {
        continue;
      }
      reset = true;
      break;
    }

    if (reset) {
      realItems.current[target.current].x = 1200;
      realItems.current[target.current].y = 100;
      realItems.current[target.current].transition =
        "left 0.2s ease-out, top 0.2s ease-out";
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
  return items;
};

export default Drag;
