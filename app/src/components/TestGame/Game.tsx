import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

import Status from './Status';
import Board, { GridType } from '../Board/Board';
import Boats, { Boat } from '../Board/Boats';

import { boatsState } from '../../components/Board/state';

import './game.scss';

const Game = () => {
  const [boats, setBoats] = useRecoilState(boatsState);

  const boatHouse = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!boatHouse.current) return;

      console.log(boatHouse.current);

      let b: Boat[] = [];
      

      

      let startX = boatHouse.current.offsetLeft;
      let startY = boatHouse.current.getBoundingClientRect().top; // ADD SCROLL?

      console.log(startY);

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
          targetX: startX,
          targetY: startY,
          width: w,
          height: h,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          move: false,
          transition: ''
        });
      }

      setBoats([...b]);
  }, []);


  useEffect(() => {
    console.log(boatHouse.current?.offsetTop);
  }, [boatHouse.current?.offsetTop])

  return (
    <div className="game-container">

      <Status></Status>
      <Boats></Boats>

      <div className="place-boats-container">
        <div className="board-container">
          <Board type={GridType.Drag}></Board>
        </div>
        <div className="boats-container">
          <div ref={boatHouse}></div>
        </div>
      </div>
    </div>
  )
};

export default Game;