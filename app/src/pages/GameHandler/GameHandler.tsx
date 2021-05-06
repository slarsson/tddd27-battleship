import React, { useState, useEffect } from 'react';
import './gameHandler.scss';
import { useRecoilState } from 'recoil';
import { currentGameState } from '../../atoms/game';
import { useParams } from 'react-router-dom';
import { Game, Loader, SelectName } from '../../components';
import { read } from '../../lib/storage';
import { newGame } from '../../lib/game';
const API_URL = import.meta.env.VITE_API_URL as string;

export const GameHandler = () => {
  const [game, setGame] = useRecoilState(currentGameState);
  const [loading, setLoading] = useState(true);
  let { id }: any = useParams();

  // useEffect(() => {
  //   console.log(currentGame);
  //   if (currentGame.alive == false) {
  //     console.log('här?');
  //     checkGame();
  //   } else {
  //     setLoading(true);
  //   }
  // }, [currentGame]);

  // Check URL if game exists
  // Check if game is in localstorage
  useEffect(() => {
    if (game.alive == true) {
      return;
    }
    const token = read(id);
    if (!token) {
      setLoading(true);
      checkGame();
    } else {
      setGame(newGame(id, token));
    }
  }, []);

  const checkGame = async () => {
    try {
      let res = await fetch(API_URL + '/available', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: id,
        }),
      });
      let data = await res.json();

      // Game exists
      if (res.status == 200) {
        setLoading(false);
      } else {
        alert('No game buddy');
      }
    } catch (e) {
      console.log('err...', e);
    }
  };

  if (game.alive) return <Game />;
  if (loading) return <Loader loaderSize={'3px solid #1D4ED8'} />;
  return <SelectName activeGameId={id} />;

  //return <>{currentGame.alive == true ? <Game /> : gameExist ? <SelectName activeGameId={id} /> : <Loader loaderSize={'3px solid #1D4ED8'} />}</>;
};
