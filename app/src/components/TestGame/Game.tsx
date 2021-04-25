import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';

import Board, { GridType } from '../Board/Board';
import Boats, { Boat } from '../Board/Boats';

import Modal from '../Modal/Modal';

import { boatsState, tileSizeState } from '../../components/Board/state';

import './game.scss';

const Game = () => {
  const [tempView, setTempView] = useState<string>('place');
  const [showModal, setShowModal] = useState<boolean>(false);

  const tempSwap = () => {
    let view = 'place';
    if (tempView == view) view = 'shoot';
    setTempView(view);
  };

  const tempShow = () => {
    setShowModal(!showModal);
  }

  return (
    <>
    <Modal visible={showModal}>
      <div>
        my div goes here..
      </div>
    </Modal>

    <div className="game-container">
      <div className="game-header">
        <h1>BATTLESHIP</h1>
        <button onClick={() => tempSwap()}>switch</button>
        <button onClick={() => tempShow()}>popup</button>
        <button>QUIT GAME</button>
      </div>

      <div className="game-inner-container">
        <div className="game-wrapper">
          <div className="game-info">
            <p><span>Player1</span> vs <span>Player2</span></p>
          </div>
          <div className="game-info">
            <p><span>Score:</span> 0 - 0</p>
          </div>
          <div className="game-info">
            <p><span className="gold">Status:</span> TODO</p>
          </div>
          {tempView == 'place' ? <PlaceBoats></PlaceBoats> : null}
          {tempView == 'shoot' ? <ShootBoats></ShootBoats> : null}
        </div>
      </div>
    </div>
    </>
  )
};

const PlaceBoats = () => {
  const [boats, setBoats] = useRecoilState<Boat[]>(boatsState);
  const tileSize = useRecoilValue<number>(tileSizeState);

  const boatHouse = useRef<HTMLDivElement | null>(null);

  const boatStuff = () => {
    if (!boatHouse.current) return;  
    
    let b: Boat[] = [];
    let startX = boatHouse.current.offsetLeft;
    let startY = boatHouse.current.getBoundingClientRect().top; // ADD SCROLL?

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
  };

  const clear = () => {
    let b: Boat[] = [];
    for (let boat of boats) {
      boat = {...boat};
      boat.x = boat.originX;
      boat.y = boat.originY;
      //boat.transition = 'left 0.2s ease-out, top 0.2s ease-out';
      b.push(boat);
    }
    setBoats([...b]);

    
    console.log('clear stuff');
  };


  useEffect(() => boatStuff(), [tileSize]);

  return (
    <div>
      <Boats></Boats>
      <div className="place-boats-container">
        <div className="board-container">
          <Board type={GridType.Drag}></Board>
        </div>
        <div className="boats-container">
          <button onClick={() => clear()}>
            remove all
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
          <div 
            ref={boatHouse}
            style={{
              minHeight: `${tileSize * 5}px`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const ShootBoats = () => {
  return (
    <div className="game-shoot-container">
      <div>
        <Board type={GridType.Click}></Board>
      </div>
      <div>
        <Board type={GridType.View} test={10}></Board>
      </div>
    </div>
  );
};

export default Game;