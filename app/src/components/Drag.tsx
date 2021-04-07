import React, { useState, useEffect, useRef } from "react";

import "./test.scss";

interface Position {
  x: number;
  y: number;
}

const Drag = () => {
  const [position, setPosition] = useState<Position>({ x: 1150, y: 100 });
  const [rotation, setRotation] = useState<number>(0);
  const [transition, setTransition] = useState<string>("");

  const mouseDown = useRef<boolean>(false);
  const newPosition = useRef<Position>(position);
  const currentRotation = useRef<number>(rotation);
  const div = useRef<HTMLDivElement>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    newPosition.current = position;
  }, [position]);

  useEffect(() => {
    currentRotation.current = rotation;
  }, [rotation]);

  const action = (evt: MouseEvent) => {
    if (!mouseDown.current) return;
    setTransition("");
    setPosition({
      x: evt.pageX - offset.current.x,
      y: evt.pageY - offset.current.y,
    });
  };

  const attach = (evt: MouseEvent) => {
    if (!div.current) return;
    const dimensions = div.current.getBoundingClientRect();

    if (
      evt.pageX < dimensions.left ||
      evt.pageX > dimensions.left + dimensions.width ||
      evt.pageY < dimensions.top ||
      evt.pageY > dimensions.top + dimensions.height
    ) {
      return;
    }

    offset.current = {
      x: evt.pageX - div.current.offsetLeft, // use div-ref since it does not care about rotation
      y: evt.pageY - div.current.offsetTop,
    };
    mouseDown.current = true;
  };

  const detache = (evt: MouseEvent) => {
    if (!mouseDown.current) return;
    mouseDown.current = false;
    if (
      evt.pageX > 1200 ||
      evt.pageX < 100 ||
      evt.pageY < 100 ||
      evt.pageY > 1000
    ) {
      setTransition("left 0.2s ease-out, top 0.2s ease-out");
      setPosition({ x: 1150, y: 100 });
    }
  };

  const keypress = (evt: KeyboardEvent) => {
    if (evt.key == "ArrowLeft") {
      setRotation(currentRotation.current + 90);
    } else if (evt.key == "ArrowRight") {
      setRotation(currentRotation.current - 90);
    }
  };

  useEffect(() => {
    mouseDown.current = false;
    document.addEventListener("mousemove", action);
    document.addEventListener("mousedown", attach);
    document.addEventListener("mouseup", detache);
    document.addEventListener("keydown", keypress);
    return () => {
      document.removeEventListener("mousemove", action);
      document.removeEventListener("mousedown", attach);
      document.removeEventListener("mouseup", detache);
      document.removeEventListener("keydown", keypress);
    };
  }, []);

  return (
    <div className="drag">
      <div
        ref={div}
        className="item"
        style={{
          left: position.x,
          top: position.y,
          transition: transition,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        x: {position.x}, y: {position.y}
      </div>
    </div>
  );
};

export default Drag;
