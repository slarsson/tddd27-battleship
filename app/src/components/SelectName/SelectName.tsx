import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Input } from '..';
import { currentGameState } from '../../atoms/game';
import { newGame } from '../../lib/game';
import './selectName.scss';

import { write } from '../../lib/storage';
const API_URL = import.meta.env.VITE_API_URL as string;

interface Player2Props {
  activeGameId: string;
}

export const SelectName = ({ activeGameId }: Player2Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const setCurrentGame = useSetRecoilState(currentGameState);

  const joinPlayer = async () => {
    const re = new RegExp(/^[0-9a-zA-Z]+$/);
    if (!re.test(player2Name)) {
      setError('Only letters and numbers in name');
      return;
    }

    if (player2Name.length > 10) {
      setError('Name must be between 1 and 10 characters long');
      return;
    }

    setLoading(true);

    try {
      let res = await fetch(API_URL + '/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: player2Name,
          gameId: activeGameId,
        }),
      });

      switch (res.status) {
        case 200:
          let data = await res.json();
          setCurrentGame(newGame(activeGameId, data.token));
          write(activeGameId, data.token);
          return;
        case 400:
          setError('Only letters and numbers in name');
          break;
        case 404:
          setError('No game found');
          break;
        case 409:
          setError('Name already taken');
          break;
        default:
          setError('Error occured :(');
          break;
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="content">
      <Input
        title={'SELECT NAME'}
        placeHolder={'Player name'}
        error={error}
        setError={setError}
        setInputValue={setPlayer2Name}
        buttonText={'JOIN'}
        loading={loading}
        onSubmit={joinPlayer}
        forceUppercase={false}
        value={player2Name}
      />
    </div>
  );
};
