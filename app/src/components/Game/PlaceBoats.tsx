import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import Board, { GridType } from '../Board/Board';
import Boats, { Boat } from '../Board/Boats';
import { boatsState, tileSizeState } from '../../components/Board/state';
import { gridActions } from '../../hooks/useGrid';
import { currentGameState } from '../../atoms/game';

const PlaceBoats = () => {
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const setBoats = useSetRecoilState<Boat[]>(boatsState);
  const tileSize = useRecoilValue<number>(tileSizeState);
  const boatHouse = useRef<HTMLDivElement | null>(null);
  const div = useRef<HTMLDivElement | null>(null);
  const grid = useRecoilValue(gridActions);
  const game = useRecoilValue(currentGameState);

  const boatStuff = () => {
    if (!boatHouse.current) return;
    let vertical = true;
    if (boatHouse.current.clientWidth >= boatHouse.current.clientHeight) vertical = false;
    let values = createBoats(boatHouse.current.offsetTop, boatHouse.current.offsetLeft, tileSize, game.boats, vertical);
    setBoats([...values]);
  };

  const resize = () => {
    boatStuff();
    if (div.current) {
      if (div.current.clientWidth > 800) {
        setMaxWidth(Math.min(window.innerHeight * 0.4, div.current.clientWidth * 0.5) - 20);
      } else {
        setMaxWidth(Math.min(window.innerHeight * 0.4, div.current.clientWidth) - 20);
      }
    }
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => boatStuff(), [tileSize]);

  return (
    <div>
      <Boats></Boats>
      <div className="place-boats-container" ref={div}>
        <div className="board-container">
          <Board type={GridType.Drag} maxWidth={maxWidth}></Board>
        </div>
        <div className="boats-container">
          <div
            ref={boatHouse}
            style={{
              width: `${tileSize * 5}px`,
              minHeight: `${tileSize * 5}px`,
              height: '90%',
            }}
          ></div>
          <button onClick={() => grid.clear()}>
            <p>CLEAR</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const createBoats = (top: number, left: number, tileSize: number, sizes: number[], vertical: boolean): Boat[] => {
  let boats: Boat[] = [];
  let nVertical = 0;
  let nHorizontal = 0;

  for (let i = 0; i < sizes.length; i++) {
    let x = left;
    let y = top;

    let w, h: number;
    if (Math.random() > 0.5) {
      w = 1;
      h = sizes[i];
      nVertical++;
    } else {
      w = sizes[i];
      h = 1;
      nHorizontal++;
    }

    boats.push({
      id: 100 + i,
      x: x,
      y: y,
      originX: x,
      originY: y,
      targetX: x,
      targetY: y,
      width: w,
      height: h,
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      move: false,
      transition: '',
    });
  }

  let space = Math.trunc(tileSize * 0.2);
  let horizontalRemaining = nHorizontal - 1;
  let verticalRemaining = nVertical - 1;

  if (vertical) {
    for (let i = 0; i < boats.length; i++) {
      if (boats[i].height > boats[i].width) {
        let offsetY = nHorizontal * (tileSize + space);
        boats[i].y += offsetY;
        boats[i].originY += offsetY;
        boats[i].targetY += offsetY;

        let offsetX = verticalRemaining * (tileSize + space);
        boats[i].x += offsetX;
        boats[i].originX += offsetX;
        boats[i].targetX += offsetX;
        verticalRemaining--;
      } else {
        let offsetY = horizontalRemaining * (tileSize + space);
        boats[i].y += offsetY;
        boats[i].originY += offsetY;
        boats[i].targetY += offsetY;
        horizontalRemaining--;
      }
    }
  } else {
    for (let i = 0; i < boats.length; i++) {
      if (boats[i].height > boats[i].width) {
        let offsetX = verticalRemaining * (tileSize + space);
        boats[i].x += offsetX;
        boats[i].originX += offsetX;
        boats[i].targetX += offsetX;
        verticalRemaining--;
      } else {
        let offsetY = horizontalRemaining * (tileSize + space);
        boats[i].y += offsetY;
        boats[i].originY += offsetY;
        boats[i].targetY += offsetY;
        horizontalRemaining--;

        let offsetX = nVertical * (tileSize + space);
        boats[i].x += offsetX;
        boats[i].originX += offsetX;
        boats[i].targetX += offsetX;
      }
    }
  }

  return boats;
};

export default PlaceBoats;
