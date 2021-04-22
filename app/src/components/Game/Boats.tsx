import React, { useState, useEffect, useRef, createRef } from 'react';

import { tileSizeState } from './Board';

import { atom, useRecoilState, useRecoilValue } from 'recoil';

export interface Boat {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  mouseOffsetX: number;
  mouseOffsetY: number;
  move: boolean;
  transition: string;
}

export let boat = atom({
  key: 'boat',
  default: {
    id: -1,
    x: 0, 
    y: 0,
    originX: 0,
    originY: 0,
    targetX: 0,
    targetY: 0,
    width: 5,
    height: 1, 
    mouseOffsetX: 0,
    mouseOffsetY: 0,
    move: false,
    transition: ''
  } as Boat
});

export let boatsState = atom({
  key: 'boatsState',
  default: [] as Boat[]
});

const Boats = () => {
  const [testBoat, setTestBoat] = useRecoilState(boat);
  const tileSize = useRecoilValue(tileSizeState);

  const allBoats = useRecoilValue(boatsState);

  const houseDiv = useRef<HTMLDivElement | null>(null);

  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    hasMounted.current = true;

    const b = {...testBoat};

    if (!houseDiv.current) return;

    console.log('top:', houseDiv.current.offsetTop);

    // let element = houseDiv.current;
    // while (element) {

    // }

    b.originX = houseDiv.current.offsetLeft;
    b.originY = window.pageYOffset + houseDiv.current.getBoundingClientRect().top;

    b.x = b.originX;
    b.y = b.originY;
    
    setTestBoat(b);

  }, []);

  useEffect(() => {
    //console.log('update..', tileSize);
    //console.log(allBoats);
  }, [allBoats]);

  useEffect(() => {
    console.log('wtf..', tileSize);
    console.log(allBoats);
  }, [tileSize])

  //console.log('size:', allBoats.length, tileSize, allBoats[0]);

  return (
    <>
    <div className="wtf" style={{top: 0, left: 0, position: 'absolute'}}>
      {/* <div 
        className="boat"
        style={{
          width: `${testBoat.width * tileSize}px`,
          height: `${testBoat.height * tileSize}px`,
          top: `${testBoat.y}px`,
          left: `${testBoat.x}px`,
          transition: testBoat.transition
        }}
      >{testBoat.x} - {testBoat.y}</div> */}


      {allBoats.map((b, i) => {
        return (<div 
          key={'boatz' + i}
          className="boat"
          style={{
            width: `${b.width * tileSize}px`,
            height: `${b.height * tileSize}px`,
            top: `${b.y}px`,
            left: `${b.x}px`,
            transition: b.transition
          }}
      >{b.x} - {b.y}</div>)
      })}
    </div>
    </>
  );
};

export default Boats;