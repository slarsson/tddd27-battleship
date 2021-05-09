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
  const [player2Name, setPlayer2Name] = useState('');
  const setCurrentGame = useSetRecoilState(currentGameState);

  const joinPlayer = async () => {
    setLoading(true);

    // check input
    if (!player2Name.match('^[A-Za-zåäö]+')) {
      alert('Var vänlig se till att namnet endast består av bokstäver A-Ö.');
      return;
    }

    // TODO: Check if playername already exists
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
      let data = await res.json();

      // new given token to player2
      setCurrentGame(newGame(activeGameId, data.token));
      write(activeGameId, data.token);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('err...', err);
    }
  };

  return (
    <div className="content">
      <h2 className="gameid">Player name</h2>
      <Input placeHolder={'Jon Doe'} setInputValue={setPlayer2Name} buttonText={'Join'} loading={loading} onSubmit={joinPlayer} />
    </div>
  );
};
