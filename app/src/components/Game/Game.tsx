import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import Board, { GridType } from '../Board/Board';
import Boats, { Boat } from '../Board/Boats';
import { TileState } from '../Board/Grid';
import Modal from '../Modal/Modal';
import { boatsState, tileSizeState } from '../../components/Board/state';

import { useHistory } from 'react-router-dom';

import { gridActions } from '../../hooks/useGrid';

import './game.scss';

const Game = () => {
  const [tempView, setTempView] = useState<string>('place');
  const grid = useRecoilValue(gridActions);
  let history = useHistory();

  const tempSwap = () => {
    let view = 'place';
    if (tempView == view) view = 'shoot';
    setTempView(view);
  };

  const exportGrid = () => {
    const arr = grid.export();
    console.log(arr);
  }

  const close = () => {
    history.push('/');
  };

  return (
    <>
    <div className="game-container">
      <div className="game-header">
        <h1>BATTLESHIP</h1>
        <div onClick={() => tempSwap()}>_</div>
        <button onClick={close}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </button>
      </div>

      <div className="game-inner-container">
        
        {tempView != 'place' ? 
          null : 
          <div className="game-wrapper">
            <div className="game-info">            
              <span>jockieboi</span> vs <span>alex_ceesay</span>
            </div>
            <div className="game-info">
              <p><span className="gold">Status:</span> place boats </p>
              <button className="button--ok" onClick={exportGrid}>
                DONE
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              </button>
            </div>
            <PlaceBoats></PlaceBoats>
          </div>
        }
        
        {tempView != 'shoot' ? 
          null : 
          <div className="shoot-boat-wrapper">
            <ShootBoats>
              <div className="game-info">            
                jockieboi vs alex_ceesay 
              </div>
              <div className="game-info">
              <p><span className="gold">Status:</span> TODO</p>
            </div>
            </ShootBoats>
          </div>
        }
      </div>
    </div>
    </>
  )
};

const PlaceBoats = () => {
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [boats, setBoats] = useRecoilState<Boat[]>(boatsState);
  const tileSize = useRecoilValue<number>(tileSizeState);
  const boatHouse = useRef<HTMLDivElement | null>(null);
  const div = useRef<HTMLDivElement | null>(null);
  const grid = useRecoilValue(gridActions);

  const boatStuff = () => {
    if (!boatHouse.current) return;  
    let vertical = false;
    if (boatHouse.current.clientWidth >= boatHouse.current.clientHeight) vertical = true;
    let values = randomBoats(boatHouse.current.offsetTop, boatHouse.current.offsetLeft, tileSize, vertical);
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
              //outline: '1px solid red',
              width: `${tileSize * 5}px`,
              minHeight: `${tileSize * 5}px`,
              height: '90%'
            }}
          ></div>
          <button onClick={() => grid.clear()}>
            <p>CLEAR</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShootBoatsProps {
  children: React.ReactNode;
}

const ShootBoats = ({children}: ShootBoatsProps) => { 
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [current, setCurrent] = useState<string>('left');
  const [myGrid, setMyGrid] = useState<TileState[]>((new Array(100)).fill(TileState.Empty));
  const [enemyGrid, setEnemyGrid] = useState<TileState[]>((new Array(100)).fill(TileState.None));
  const div = useRef<HTMLDivElement | null>(null);

  const onShoot = (index: number, value: TileState) => {
    myGrid[index] = TileState.Loading;
    setMyGrid([...myGrid]);
    console.log('index:', index, 'state:', value);
  }

  const resize = () => {
    if (div.current) {
      if (div.current.clientWidth <= 800) {
        setMaxWidth(div.current.clientWidth - 20);
        return;
      }      
      setMaxWidth((div.current.clientWidth - 20) * 0.5);
    }
  };

  useEffect(() => {
    const x = () => {
      let i = Math.trunc(Math.random() * 100);
      enemyGrid[i] =TileState.Miss;
      setEnemyGrid([...enemyGrid]);
    };
    let itrv = setInterval(() => x(), 5000);
    
    resize();
    window.addEventListener('resize', resize);
    return () => {
      clearInterval(itrv);
      window.removeEventListener('resize', resize);
    };
  }, []);

  let nodes: JSX.Element;
  let buttons: JSX.Element;

  if (div.current == null) {
    buttons = <></>;
    nodes = <></>;
  } else if (div.current.clientWidth > 800) {
    buttons = <></>;
    nodes = (
      <>
      <div>
        <Board type={GridType.View} maxWidth={maxWidth} grid={myGrid} handler={onShoot}></Board>
      </div>
      <div>
        <Board type={GridType.View} maxWidth={maxWidth} grid={enemyGrid}></Board>
      </div>
      </>
    );
  } else {
    buttons = (
      <div className="game-shoot-switch">
        <button onClick={() => setCurrent('left')}>ENEMY</button>
        <button onClick={() => setCurrent('right')}>MYSELF</button>
      </div>
    );
    
    if (current == 'left') {
      nodes = (
        <div>
          <h1>left</h1>
          <Board type={GridType.View} maxWidth={maxWidth} grid={myGrid} handler={onShoot}></Board>
        </div>
      );
    } else if (current == 'right') {
      nodes = (
        <div>
          <h1>right</h1>
          <Board type={GridType.View} maxWidth={maxWidth} grid={enemyGrid}></Board>
        </div>
      );
    } else {
      nodes = <></>;
    }
  }

  return (
    <>
    <div className="game-shoot-container" ref={div}>
      <div className="game-shoot-wrapper">
        <div className="game-shoot-info">
          {children}
        </div>
        {nodes}
      </div>
    </div>
    {buttons}
    </>
  );
};

const randomBoats = (top: number, left: number, tileSize: number, mobile: boolean = false): Boat[] => {
  let vertical = 0;
  let horizontal = 0;  
  let boats: Boat[] = [];
  let maxY = 0;
  let maxX = 0;

  for (let i = 0; i < 5; i++) {
    let w = Math.ceil(Math.random() * 4) + 1;
    let h = 1;
    if (i > 2) {
      h = Math.ceil(Math.random() * 4) + 1;
      w = 1;
    }

    let x: number;
    let y: number;

    if (w > h) {
      x = left;
      y = top + tileSize * vertical;
      vertical++;
      maxY = y;
    } else {
      x = left + horizontal * tileSize;
      y = top + 5 * tileSize ;
      horizontal++;
      maxX = x;
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
      transition: ''
    });
  }


  if (mobile) {
    let i = 0;
    for (let boat of boats) {
      if (boat.y > maxY) {
        boat.x = left + (5 + i) * tileSize;
        boat.originX = left + (5 + i) * tileSize;
        boat.targetX = left + (5 + i) * tileSize;
        boat.y = top;
        boat.originY = top;
        boat.targetY = top;
        i++;
      }
    }
  } else {
    for (let boat of boats) {
      if (boat.y > maxY) {
        boat.y = maxY + tileSize;
        boat.originY = maxY + tileSize;
        boat.targetY = maxY + tileSize;
      }
    }
  }

  return boats;
};

export default Game;
