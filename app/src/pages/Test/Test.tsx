import React, { useEffect } from "react";
import Grid from "../../components/Game/Grid";

import Boats, { Boat } from '../../components/Game/Boats';

import { boatsState } from '../../components/Game/state';

import Board, { GridType } from './../../components/Game/Board';
import { useRecoilState } from "recoil";

import './test.scss';


const startX = 500;

export const Test = () => {
  const [allBoats, setAllBoats] = useRecoilState(boatsState);
 
  useEffect(() => {
    let b: Boat[] = [];
    
    let startX = 100;
    let startY = 100;

    for (let i = 0; i < 5; i++) {
      let w = Math.ceil(Math.random() * 4) + 1;
      let h = 1;
      if (i > 2) {
        h = Math.ceil(Math.random() * 4) + 1;
        w = 1;
      }

      b.push({
        id: 100 + i,
        x: startX,
        y: startY,
        originX: startX,
        originY: startY,
        targetX: 0,
        targetY: 0,
        width: w,
        height: h,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        move: false,
        transition: ''
      });
    }

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
    <div className="mytest">
      
      <h1>My grid</h1>
      
      <Board type={GridType.Drag}></Board>

      <Boats></Boats>

      {/* <Board type={GridType.Click}></Board> */}
    </div>
  )
}

