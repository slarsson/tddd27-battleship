import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';
import { gridActions } from '../../hooks/useGrid';
import { ws } from '../../lib/ws';
import { GameState, MessageType } from '../../../../interfaces';
import { currentGameState } from '../../atoms/game';
import PlaceBoats from './PlaceBoats';
import ShootBoats from './ShootBoats';

const WS_URL = import.meta.env.VITE_WS as string;
import './game.scss';
import Waiting from './Waiting';
import Header from '../Header/Header';
import ErrorText from '../ErrorText';

const Game = () => {
  const [game, setGame] = useRecoilState(currentGameState);
  const [error, setError] = useState(false);
  const grid = useRecoilValue(gridActions);
  const send = useRef<any>(() => {});

  const exportGrid = () => {
    send.current({
      type: MessageType.SetBoats,
      gameId: game.gameId,
      token: game.token,
      grid: grid.export(),
    });
  };

  const onMessage = (msg: any) => {
    console.log('msg:', msg);
    if (msg.type == MessageType.StateUpdate) {
      let state = { ...game };
      state.view = msg.gameState;
      //state.view = GameState.PlaceBoats;
      state.myGrid = msg.boards[0];
      state.enemyGrid = msg.boards[1];
      state.yourTurn = msg.yourTurn;
      state.boats = msg.boats;
      state.myScore = msg.myScore;
      state.enemyScore = msg.enemyScore;
      state.myName = msg.myName;
      state.enemyName = msg.enemyName;
      setGame(state);
    }
  };

  const onError = () => {
    setError(true);
  };

  useEffect(() => {
    let closeHandler: any = null;

    ws(WS_URL, onMessage, onError).then((fn) => {
      send.current = fn.send;
      closeHandler = fn.close;

      fn.send({
        type: MessageType.Connect,
        gameId: game.gameId,
        token: game.token,
      });
    });

    return () => {
      if (closeHandler) closeHandler();
    };
  }, []);

  return (
    <>
      {error ? <ErrorText /> : null}
      <div className="game-container">
        <Header />
        {game.view == GameState.WaitingForPlayers ? (
          <Waiting gameId={game.gameId} />
        ) : (
          <div className="game-inner-container">
            {game.view == GameState.PlaceBoats ? (
              <div className="game-wrapper">
                <div className="game-info">
                  <span>{game.myName}</span> vs <span>{game.enemyName}</span>
                </div>

                <div className="game-info">
                  <p>
                    Place your boats on the grid. Press <kbd>R</kbd> to rotate.
                  </p>
                </div>
                <PlaceBoats></PlaceBoats>
                <div className="place-boat-actions">
                  <button className="random" onClick={grid.random}>
                    RANDOM
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                    </svg>
                  </button>
                  <button className="send" onClick={exportGrid}>
                    SAVE
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : null}
            {game.view == GameState.ShootBoats || game.view == GameState.Completed ? (
              <div className="shoot-boat-wrapper">
                <ShootBoats send={send.current}>
                  <div className="game-info">
                    <div className="score">
                      <span>
                        {game.myName}: {game.myScore}
                      </span>{' '}
                      vs{' '}
                      <span>
                        {game.enemyName}: {game.enemyScore}
                      </span>
                    </div>
                  </div>
                  {game.view == GameState.Completed ? (
                    <div className="game-info">GAME OVER</div>
                  ) : (
                    <div className="game-info">
                      <div className={`status ${game.yourTurn ? 'ok' : 'waiting'}`}>{game.yourTurn ? `It's your turn!` : `Waiting for other player`}</div>
                    </div>
                  )}
                </ShootBoats>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
