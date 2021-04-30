
import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import Board, { GridType } from '../Board/Board';
import { TileState } from '../Board/Grid';
import { MessageType } from '../../../../interfaces';
import { currentGameState } from '../../atoms/game';


interface ShootBoatsProps {
  children: React.ReactNode;
  send: (msg: any) => void;
}

const ShootBoats = ({children, send}: ShootBoatsProps) => { 
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [current, setCurrent] = useState<string>('left');
  const game = useRecoilValue(currentGameState);
  const div = useRef<HTMLDivElement | null>(null);

  const onShoot = (index: number, value: TileState) => {
    console.log('index:', index, 'state:', value);
    send({
      type: MessageType.Shoot,
      gameId: game.gameId,
      token: game.token,
      index: index
    });
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
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
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
        <Board type={GridType.View} maxWidth={maxWidth} grid={game.myGrid} handler={onShoot}></Board>
        <p>Enemy board</p>
      </div>
      <div>
        <Board type={GridType.View} maxWidth={maxWidth} grid={game.enemyGrid}></Board>
        <p>Your board</p>
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
          <Board type={GridType.View} maxWidth={maxWidth} grid={game.myGrid} handler={onShoot}></Board>
        </div>
      );
    } else if (current == 'right') {
      nodes = (
        <div>
          <Board type={GridType.View} maxWidth={maxWidth} grid={game.enemyGrid}></Board>
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

export default ShootBoats;