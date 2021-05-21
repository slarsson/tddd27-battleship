import React, { useState } from 'react';
import './home.scss';
import { Input } from '../../components';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { currentGameState } from '../../atoms/game';
import { write } from '../../lib/storage';
import { newGame } from '../../lib/game';
import logo from '../../assets/logo.svg';
const API_URL = import.meta.env.VITE_API_URL as string;

export const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState({ create: false, join: false });
  const setCurrentGame = useSetRecoilState(currentGameState);
  const [error, setError] = useState({ create: '', join: '' });
  let history = useHistory();

  const handleCreate = async () => {
    const re = new RegExp(/^[0-9a-zA-Z]+$/);
    if (!re.test(playerName)) {
      setError({ ...error, create: 'Only letters and numbers in name' });
      return;
    }

    if (playerName.length > 10) {
      setError({
        ...error,
        create: 'Name must be between 1 and 10 characters long',
      });
      return;
    }

    setLoading({ ...loading, create: true });

    try {
      let res = await fetch(API_URL + '/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
        }),
      });
      let data = await res.json();
      setCurrentGame(newGame(data.gameId, data.token));
      write(data.gameId, data.token);
      history.push(`/g/${data.gameId}`);
      return;
    } catch (e) {
      setError({ ...error, create: 'Network error :(' });
    }
    setLoading({ ...loading, create: false });
  };

  const handleJoin = async () => {
    setLoading({ ...loading, join: true });

    try {
      let res = await fetch(API_URL + '/available', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: gameId,
        }),
      });

      switch (res.status) {
        case 200:
          history.push(`/g/${gameId}`);
          return;
        case 400:
        case 404:
          setError({ ...error, join: 'No game found with that id' });
          break;
        default:
          setError({ ...error, join: 'Error occured :(' });
          break;
      }
    } catch (e) {
      setError({ ...error, join: 'Network error :(' });
    }
    setLoading({ ...loading, join: false });
  };

  return (
    <div className="container">
      <div className="main-logo">
        <img src={logo} className="img" />
      </div>

      <Input
        title={'CREATE GAME'}
        placeHolder={'Player name'}
        error={error.create}
        setError={(value: string) =>
          setError({
            create: value,
            join: error.join,
          })
        }
        setInputValue={setPlayerName}
        buttonText={'CREATE'}
        loading={loading.create}
        onSubmit={handleCreate}
        value={playerName}
      />
      <Input
        title={'JOIN GAME'}
        placeHolder={'Game id'}
        error={error.join}
        setError={(value: string) =>
          setError({
            create: error.create,
            join: value,
          })
        }
        setInputValue={setGameId}
        buttonText={'JOIN'}
        loading={loading.join}
        onSubmit={handleJoin}
        forceUppercase={true}
        value={gameId}
      />
    </div>
  );
};
