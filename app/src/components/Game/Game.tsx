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

const Game = () => {
  const [game, setGame] = useRecoilState(currentGameState);
  const grid = useRecoilValue(gridActions);
  const send = useRef<any>(() => {});
  let history = useHistory();

  const exportGrid = () => {
    send.current({
      type: MessageType.SetBoats,
      gameId: game.gameId,
      token:  game.token,
      grid: grid.export()
    });
    console.log(grid.export());
  }

  const onMessage = (msg: any) => {
    console.log('msg:', msg);
    if (msg.type == MessageType.StateUpdate) {
      let state = {...game};
      state.view = msg.gameState;
      state.myGrid = msg.boards[0];
      state.enemyGrid = msg.boards[1];
      state.yourTurn = msg.yourTurn;
      state.boats = msg.boats;

      state.myName = msg.myName;
      state.enemyName = msg.enemyName;
      setGame(state);
    }

  };

  const onError = () => {
    console.log('TODO: error my error');
  };

  useEffect(() => {
    ws(WS_URL, onMessage, onError).then(fn => {
      console.log('first');
      send.current = fn;  
      fn({
          type: MessageType.Connect,
          gameId: game.gameId,
          token: game.token,
      });
    });
  }, []);

  return (
    <>
    <div className="game-container">
      <div className="game-header">
        <h1>BATTLESHIP</h1>
        <button onClick={() => history.push('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </button>
      </div>
      <div className="game-inner-container">
        {game.view == GameState.PlaceBoats ? 
          <div className="game-wrapper">
            <div className="game-info">            
              <span>{game.myName}</span> vs <span>{game.enemyName}</span>
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
          : null
        }
        {game.view == GameState.ShootBoats ? 
          <div className="shoot-boat-wrapper">
            <ShootBoats send={send.current}>
              <div className="game-info">            
                <div className="score">
                  <span>{game.myName}</span> vs <span>{game.enemyName}</span>
                </div>
              </div>
              <div className="game-info">
                <div className={`status ${game.yourTurn ? 'ok' : 'waiting'}`}>
                  {game.yourTurn ? `It's your turn!` : `Waiting for other player`}
                </div>
              </div>
            </ShootBoats>
          </div>
          : null
        }
        {game.view == GameState.WaitingForPlayers ? 
          <div>
             waiting for players..
          </div>
          : null
        }
      </div>
    </div>
    </>
  )
};

export default Game;
