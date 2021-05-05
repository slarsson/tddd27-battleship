import React, { useState, useEffect } from 'react';
import './home.scss';
import battleship from '../../assets/battleship.png';
import { Button, Input } from '../../components';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { currentGameState } from '../../atoms/game';
import { GameState } from '../../../../interfaces';
import { write } from '../../lib/storage';
import { newGame } from '../../lib/game';
import logo from '../../assets/logo.svg';
const API_URL = import.meta.env.VITE_API_URL as string;

export const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [createToggler, setCreateToggler] = useState(true);
  const [joinToggler, setJoinToggler] = useState(true);
  const [loading, setLoading] = useState(false);
  const setCurrentGame = useSetRecoilState(currentGameState); //TODO: läs in från localstorage för att plocka redan existerande
  let history = useHistory();

  useEffect(() => {}, [playerName, gameId]);

  const handleCreate = async () => {
    setLoading(true);

    // TODO: check playerName
    if (!playerName) {
      return;
    }

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
      console.log(data);

      setCurrentGame(newGame(data.gameId, data.token));
      write(data.gameId, data.token);
      setLoading(false);
      history.push(`/g/${data.gameId}`);
    } catch (e) {
      setLoading(false);
      console.log('err...', e);
    }
  };

  const handleJoin = async () => {
    // TODO: Check gameId
    setLoading(true);
    console.log('gameid', gameId);

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
      let data = await res.json();

      // Game exists
      if (data.ok) {
        setLoading(false);
        history.push(`/g/${gameId}`);
      } else {
        setLoading(false);
        alert('No game asdasd');
      }
    } catch (e) {
      console.log('err...', e);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div>
        <img src={logo} className="img" />
      </div>

      <div className="button-container">
        <form className="form">{createToggler ? <Button text={'Create Game'} setToggler={setCreateToggler} toggler={createToggler} /> : <Input setToggler={setCreateToggler} placeHolder={'Player name'} setInputValue={setPlayerName} buttonText={'Create'} loading={loading} onSubmit={handleCreate} />}</form>

        <form className="form">{joinToggler ? <Button text={'Join Game'} setToggler={setJoinToggler} toggler={joinToggler} /> : <Input setToggler={setJoinToggler} placeHolder={'Game id'} setInputValue={setGameId} buttonText={'Join'} loading={loading} onSubmit={handleJoin} />}</form>
      </div>
    </div>
  );
};
