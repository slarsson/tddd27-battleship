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
import Modal from '../Modal/Modal';

enum GameOver {
  TBD,
  Winner,
  Loser,
}

const Game = () => {
  const [game, setGame] = useRecoilState(currentGameState);
  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [gameOver, setGameOver] = useState<GameOver>(GameOver.TBD);
  const [gameOverModal, setGameOverModal] = useState(false);
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
    console.log(msg);

    if (msg.type == MessageType.StateUpdate) {
      setGame((value) => {
        if (msg.gameState == GameState.PlaceBoats) {
          setWaiting(msg.done);
        } else {
          setWaiting(false);
        }

        if (
          value.view == GameState.ShootBoats &&
          msg.gameState == GameState.Completed
        ) {
          if (msg.myScore > msg.enemyScore) {
            setGameOver(GameOver.Winner);
          } else {
            setGameOver(GameOver.Loser);
          }
          setGameOverModal(true);
        }

        let state = { ...value };
        state.view = msg.gameState;
        state.myGrid = msg.boards[0];
        state.enemyGrid = msg.boards[1];
        state.yourTurn = msg.yourTurn;
        state.boats = msg.boats;
        state.myScore = msg.myScore;
        state.enemyScore = msg.enemyScore;
        state.myName = msg.myName;
        state.enemyName = msg.enemyName;
        return state;
      });
      return;
    }

    if (msg.type == MessageType.NotFound) {
      setError(true);
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
      console.log('CLOSE CONNECTION');
      setGame({ ...game, alive: false });
      if (closeHandler) closeHandler();
    };
  }, []);

  return (
    <>
      {error ? <ErrorText /> : null}
      {gameOver == GameOver.TBD ? null : (
        <Modal visible={gameOverModal} setVisible={setGameOverModal}>
          {gameOver == GameOver.Winner ? (
            <div className="gameover-modal">
              <div className="gameover-header">
                <button onClick={() => setGameOverModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
              <div className="gameover-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <rect fill="none" height="24" width="24" />
                  <path d="M19,5h-2V3H7v2H5C3.9,5,3,5.9,3,7v1c0,2.55,1.92,4.63,4.39,4.94c0.63,1.5,1.98,2.63,3.61,2.96V19H7v2h10v-2h-4v-3.1 c1.63-0.33,2.98-1.46,3.61-2.96C19.08,12.63,21,10.55,21,8V7C21,5.9,20.1,5,19,5z M5,8V7h2v3.82C5.84,10.4,5,9.3,5,8z M12,14 c-1.65,0-3-1.35-3-3V5h6v6C15,12.65,13.65,14,12,14z M19,8c0,1.3-0.84,2.4-2,2.82V7h2V8z" />
                </svg>
                <h2>WINNER</h2>
                <p>Congratulations, you won the game!</p>
              </div>
            </div>
          ) : (
            <div className="gameover-modal loser">
              <div className="gameover-header">
                <button onClick={() => setGameOverModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
              <div className="gameover-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <circle cx="15.5" cy="9.5" r="1.5" />
                  <circle cx="8.5" cy="9.5" r="1.5" />
                  <path d="M12 14c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5zm-.01-12C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
                <h2>GAME OVER</h2>
                <p>You lost! Better luck next time.</p>
              </div>
            </div>
          )}
        </Modal>
      )}
      <Modal visible={waiting} disabled={true}>
        <div className="waiting-modal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <g>
              <rect fill="none" height="24" width="24" />
            </g>
            <g>
              <path d="M6,2l0.01,6L10,12l-3.99,4.01L6,22h12v-6l-4-4l4-3.99V2H6z M16,16.5V20H8v-3.5l4-4L16,16.5z" />
            </g>
          </svg>
          <div>
            <h3>WAITING FOR OTHER PLAYER</h3>
            <p>Please wait for other player to place their boats</p>
          </div>
        </div>
      </Modal>
      <div className="game-container">
        <Header />
        {game.view == GameState.WaitingForPlayers ? (
          <Waiting gameId={game.gameId} />
        ) : (
          <div className="game-inner-container">
            {game.view == GameState.PlaceBoats ? (
              <div className="game-wrapper">
                <div className="game-info">
                  <div className="player-info">
                    <div>{game.myName}</div>
                    <div>vs</div>
                    <div>{game.enemyName}</div>
                  </div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                    </svg>
                  </button>
                  <button className="send" onClick={exportGrid}>
                    SAVE
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : null}
            {game.view == GameState.ShootBoats ||
            game.view == GameState.Completed ? (
              <ShootBoats send={send.current}>
                <div className="game-info">
                  <div>
                    <div className="player-info">
                      <div>{game.myName}</div>
                      <div>vs</div>
                      <div>{game.enemyName}</div>
                    </div>
                    <div className="score">
                      {game.myScore} - {game.enemyScore}
                    </div>
                  </div>
                </div>
                {game.view == GameState.Completed ? (
                  <div className="game-info">GAME OVER</div>
                ) : (
                  <div className="game-info">
                    <div
                      className={`status ${game.yourTurn ? 'ok' : 'waiting'}`}
                    >
                      {game.yourTurn
                        ? `It's your turn!`
                        : `Waiting for other player`}
                    </div>
                  </div>
                )}
              </ShootBoats>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
