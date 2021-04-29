import React, { useState, useEffect } from "react";
import "./home.scss";
import battleship from "../../assets/battleship.png";
import { Button, Input } from "../../components";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currentGameState } from "../../atoms/game";

export const Home = () => {
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [createToggler, setCreateToggler] = useState(true);
  const [joinToggler, setJoinToggler] = useState(true);
  const [loading, setLoading] = useState(false);
  const setGlobalGameState = useSetRecoilState(currentGameState); //TODO: läs in från localstorage för att plocka redan existerande
  let history = useHistory();
  let url = "http://localhost:3000";
  
  useEffect(() => {}, [playerName, gameId]);

  const handleCreate = async () => {
    setLoading(true);

    // TODO: check playerName
    if (!playerName) {
      return;
    }

    try {
      let res = await fetch(url + "/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playerName,
        }),
      });
      let data = await res.json();

      setGlobalGameState({ gameId: data.gameId, token: data.token })

      // TODO: skriv till localstorage
      setLoading(false);
      history.push(`/g/${data.gameId}`);
    } catch (e) {
      setLoading(false);
      console.log("err...", e);
    }
  };

  const handleJoin = async () => {

    // TODO: Check gameId
    setLoading(true);
    console.log("gameid", gameId);

    try {
      let res = await fetch(url + "/available", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        alert("No game asdasd");
      }
    } catch (e) {
      console.log("err...", e);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div>
        <img src={battleship} className="img"></img>
        <h1 className="header">Battleship</h1>
      </div>

      <div className="button-container">
        <form className="form">
          {createToggler ? (
            <Button
              text={"Create Game"}
              setToggler={setCreateToggler}
              toggler={createToggler}
            />
          ) : (
            <Input setToggler={setCreateToggler} placeHolder={"Player name"} setInputValue={setPlayerName} buttonText={"Create"} loading={loading} onSubmit={handleCreate} />
          )}
        </form>

        <form className="form">
          {joinToggler ? (
            <Button
              text={"Join Game"}
              setToggler={setJoinToggler}
              toggler={joinToggler}
            />
          ) : (
            <Input setToggler={setJoinToggler} placeHolder={"Game id"} setInputValue={setGameId} buttonText={"Join"} loading={loading} onSubmit={handleJoin} />
          )}
        </form>
      </div>
    </div>
  );
};