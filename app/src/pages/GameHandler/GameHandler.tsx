import React, { useState, useEffect } from 'react';
import './gameHandler.scss';
import { useRecoilState } from 'recoil';
import { currentGameState } from '../../atoms/game';
import { useParams } from 'react-router-dom';
import { Game, Loader, SelectName } from '../../components';
import { read } from '../../lib/storage';
import { newGame } from '../../lib/game';
import Header from '../../components/Header/Header';
const API_URL = import.meta.env.VITE_API_URL as string;

export const GameHandler = () => {
  const [game, setGame] = useRecoilState(currentGameState);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  let { id }: any = useParams();

  useEffect(() => {
    if (game.alive == true) {
      return;
    }
    const token = read(id);
    if (!token) {
      checkGame();
    } else {
      setGame(newGame(id, token));
    }
  }, []);

  const checkGame = async () => {
    setLoading(true);
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

      if (res.status != 200) {
        setNotFound(true);
      }
    } catch (e) {
      alert('NETWORK ERROR :(');
    }
    setLoading(false);
  };

  if (game.alive) return <Game />;

  if (loading)
    return <Loader size="50px" color="#fff" borderSize="6px" center={true} />;

  if (notFound) {
    return (
      <div className="not-found">
        <h1>GAME NOT FOUND</h1>
      </div>
    );
  }

  return (
    <div className="game-handler-container">
      <Header />
      <div className="game-handler-content">
        <SelectName activeGameId={id} />
      </div>
    </div>
  );
};
