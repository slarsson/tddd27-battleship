import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import Board, { GridType } from '../Board/Board';
import { GameState, TileState } from '../../../../interfaces';
import { MessageType } from '../../../../interfaces';
import { currentGameState } from '../../atoms/game';

interface ShootBoatsProps {
  children: React.ReactNode;
  send: (msg: any) => void;
}

const ShootBoats = ({ children, send }: ShootBoatsProps) => {
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [current, setCurrent] = useState<string>('left');
  const [game, setGame] = useRecoilState(currentGameState);
  const div = useRef<HTMLDivElement | null>(null);

  const onShoot = (index: number, value: TileState) => {
    if (!game.yourTurn) return;
    if (game.view !== GameState.ShootBoats) return;

    console.log('index:', index, 'state:', value);

    let x = { ...game };
    x.enemyGrid = [...game.enemyGrid];
    x.enemyGrid[index] = TileState.Loading;
    setGame(x);

    send({
      type: MessageType.Shoot,
      gameId: game.gameId,
      token: game.token,
      index: index,
    });
  };

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
      <div className="game-shoot-xl">
        <div>
          <Board type={GridType.View} maxWidth={maxWidth} grid={game.enemyGrid} handler={onShoot}></Board>
          <p>Enemy board</p>
        </div>
        <div>
          <Board type={GridType.View} maxWidth={maxWidth} grid={game.myGrid}></Board>
          <p>Your board</p>
        </div>
      </div>
    );
  } else {
    buttons = (
      <>
        <button onClick={() => setCurrent('left')} className={current == 'left' ? 'active' : ''}>
          ENEMY BOARD
        </button>
        <button onClick={() => setCurrent('right')} className={current == 'right' ? 'active' : ''}>
          MY BOARD
        </button>
      </>
    );

    if (current == 'left') {
      nodes = (
        <div>
          <Board type={GridType.View} maxWidth={maxWidth} grid={game.enemyGrid} handler={onShoot}></Board>
        </div>
      );
    } else if (current == 'right') {
      nodes = (
        <div>
          <Board type={GridType.View} maxWidth={maxWidth} grid={game.myGrid}></Board>
        </div>
      );
    } else {
      nodes = <></>;
    }
  }

  return (
    <div className="game-shoot-container" ref={div}>
      <div className="game-shoot-board">
        <div className="game-shoot-header">{children}</div>
        {nodes}
      </div>
      <div className="game-shoot-switch">{buttons}</div>
    </div>
  );
};

export default ShootBoats;
