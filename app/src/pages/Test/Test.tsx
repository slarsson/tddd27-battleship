import React, { useEffect } from "react";
import Grid from "../../components/Game/Grid";

import Boats, { boatsState, Boat } from '../../components/Game/Boats';

import Board, { GridType } from './../../components/Game/Board';
import { useRecoilState } from "recoil";

export const Test = () => {
  const [allBoats, setAllBoats] = useRecoilState(boatsState);
 
  useEffect(() => {
    let b: Boat[] = [];
    b.push({
      id: 101,
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
    });

    b.push({
      id: 102,
      x: 0, 
      y: 0,
      originX: 0,
      originY: 0,
      targetX: 0,
      targetY: 0,
      width: 1,
      height: 3, 
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      move: false,
      transition: ''
    });

    b.push({
      id: 103,
      x: 0, 
      y: 0,
      originX: 0,
      originY: 0,
      targetX: 0,
      targetY: 0,
      width: 2,
      height: 2, 
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      move: false,
      transition: ''
    });

    b.push({
      id: 104,
      x: 0, 
      y: 0,
      originX: 0,
      originY: 600,
      targetX: 0,
      targetY: 0,
      width: 4,
      height: 1, 
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      move: false,
      transition: ''
    });

    //console.log(b);
    setAllBoats([...b]);
  }, []);

  // return (
  //   <>
  //   <div style={{display: 'flex'}}>
  //     TEST ROUTE
  //     <Board type={GridType.Drag}></Board>

  //     <div style={{marginLeft: '50px'}}></div>

  //     <Board type={GridType.Click}></Board>
  //   </div>
  //   <Boats></Boats>
  //   </>
  // )


  return (
    <div>
      <Board type={GridType.Drag}></Board>

      <Boats></Boats>
    </div>
  )
}

