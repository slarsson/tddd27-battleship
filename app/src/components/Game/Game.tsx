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
                    <span className="gold">Status:</span> place boats{' '}
                  </p>
                  <button className="button--ok" onClick={exportGrid}>
                    DONE
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                  </button>
                </div>
                <PlaceBoats></PlaceBoats>
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
